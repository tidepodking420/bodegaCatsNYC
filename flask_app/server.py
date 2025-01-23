from flask import Flask, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pin.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)
db = SQLAlchemy(app)
api_key_path='/home/user/vscode/secrets.txt'

class cat(db.Model):
    __tablename__ = 'cat'
    id = db.Column("id", db.Integer, primary_key=True)
    name = db.Column(db.String(25), nullable=False)
    desc = db.Column(db.String(100), nullable=False)
    # Foreign key to `pin` table
    pin_id = db.Column(db.Integer, db.ForeignKey('pin.id'), nullable=False)

    def __init__(self, name, desc, pin_id):
        self.name = name
        self.desc = desc
        self.pin_id = pin_id

    def __repr__(self):
        return f"<Cat(id={self.id}, name={self.name}, desc={self.desc}, pin_id={self.pin_id})>"
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "desc": self.desc,
            "pin_id": self.pin_id
        }

class pin(db.Model):
    __tablename__ = 'pin'
    id = db.Column("id", db.Integer, primary_key=True)
    lat = db.Column(db.Float, nullable=False)
    lng = db.Column(db.Float, nullable=False)
    # address field to implement google maps stuff
    # name of the business

    # One-to-many relationship to cats; deletes associated cats
    # when the pin gets deleted
    cats = db.relationship('cat', backref='pin', lazy=True, cascade="all, delete-orphan")

    def __init__(self, lat, lng):
        self.lat = lat
        self.lng = lng

    def __repr__(self):
        return f"<Pin(id={self.id}, lat={self.lat}, lng={self.lng}, cats={[cat.id for cat in self.cats]})>"
    
    def to_dict(self):
        # Convert SQLAlchemy model to a dictionary
        return {
            "id": self.id,
            "lat": self.lat,
            "lng": self.lng,
            "cats": [cat.id for cat in self.cats]
        }

@app.route('/cat', methods=['GET'])
def cat_logic():
    # retrieving the cats at specific id
    return {'cats' : list(map(lambda x: x.to_dict(), cat.query.filter_by(pin_id=request.args.get('pin_id')).all()))}



@app.route('/pin', methods=['GET', 'POST', 'DELETE', 'PATCH'])
def pin_logic():
    # its easier to add the cats using patch
    if request.method == 'POST':
        # this method should create a new pin, and return an id
        lat = request.json.get('lat')
        lng = request.json.get('lng')
        new_pin = pin(lat, lng)
        db.session.add(new_pin)
        db.session.commit()
        return {'id': new_pin.id}
    elif request.method == 'DELETE':
        id = request.json.get('id')
        pin_to_delete = pin.query.filter_by(id=id).first()
        db.session.delete(pin_to_delete)
        db.session.commit()
        return {"message": f"Pin {id} deleted successfully."}
    elif request.method == 'PATCH':
        # what can I do in a patch
        # start with create a new cat, TODO modify an existing cat, or delete one of the cats
        # 1. create a new cat
        cat_name = request.json.get('name')
        cat_desc = request.json.get('desc')
        pin_id = request.json.get('id')
        new_cat = cat(name=cat_name, desc=cat_desc, pin_id=pin_id)
        db.session.add(new_cat)
        db.session.commit()
        all_cats = list(map(lambda x: x.to_dict(), cat.query.filter_by(pin_id=pin_id).all()))
        return {'assoicated_cats': all_cats,
                'pin_id': pin_id
                }
    else:
        # default is GET
        pin_list = [p.to_dict() for p in db.session.query(pin).all()]
        print(db.session.query(pin).all())
        return {'pins': pin_list}

@app.route('/api_key/map_tiler')
def home():
    with open(api_key_path, 'r') as file:
        first_line = file.readline()
        api_secret = first_line[first_line.index('=') + 1:len(first_line) - 1]
        return {'map_tiler': api_secret}

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        app.run(debug=True)