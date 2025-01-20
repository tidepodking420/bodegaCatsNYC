from flask import Flask, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pin.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)
db = SQLAlchemy(app)
api_key_path='/home/user/vscode/secrets.txt'

class pin(db.Model):
    __tablename__ = 'pin'
    _id = db.Column("id", db.Integer, primary_key=True)
    lat = db.Column(db.Float, nullable=False)
    lng = db.Column(db.Float, nullable=False)

    def __init__(self, lat, lng):
        self.lat = lat
        self.lng = lng

    def __repr__(self):
        return f"<Pin(id={self._id}, lat={self.lat}, lng={self.lng})>"
    
    def to_dict(self):
        # Convert SQLAlchemy model to a dictionary
        return {
            "id": self._id,
            "lat": self.lat,
            "lng": self.lng
        }
    
def find_pin_by_coords(lat, lng):
    return pin.query.filter_by(lat=lat, lng=lng).first()


@app.route('/pin', methods=['GET', 'POST', 'DELETE'])
def pin_logic():
    if request.method == 'POST':
        # this method should create a new pin, and return a message if 
        # done successfully
        prev_count = db.session.query(pin).count()
        lat = request.json.get('lat')
        lng = request.json.get('lng')
        new_pin = pin(lat, lng)
        db.session.add(new_pin)
        db.session.commit()
        return {'prev_count': prev_count, 'new_count': db.session.query(pin).count()}
    elif request.method == 'DELETE':
        lat = request.json.get('lat')
        lng = request.json.get('lng')
        pin_to_delete = find_pin_by_coords(lat, lng)
        db.session.delete(pin_to_delete)
        db.session.commit()
        return {"message": f"Pin at coordinates ({lat}, {lng}) deleted successfully."}
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