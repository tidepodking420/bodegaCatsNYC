from flask import Flask, request, jsonify
from flask_cors import CORS
from mysql.connector import pooling

app = Flask(__name__)
CORS(app)
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'password'
app.config['MYSQL_DB'] = 'cat_app'

# Function to get a database connection
connection_pool = pooling.MySQLConnectionPool(
    pool_name="Swimming_Pools_Drank",
    pool_size=5,
    host=app.config['MYSQL_HOST'],
    user=app.config['MYSQL_USER'],
    password=app.config['MYSQL_PASSWORD'],
    database=app.config['MYSQL_DB']
)

def execute_query(query):
    mydb = connection_pool.get_connection()
    cursor = mydb.cursor()
    cursor.execute(query)
    rows = cursor.fetchall()
    mydb.close()
    return rows


@app.route('/')
def index():
    return execute_query("SELECT * FROM cat")


class Cat(object):
    def __init__(self, id, name, desc, pin_id):
        self.id = id
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
    
    def map_to_cat(rows):
        return [Cat(id=row[0], name=row[1], desc=row[2], pin_id=row[3]).to_dict() for row in rows]

# class pin(db.Model):
#     __tablename__ = 'pin'
#     id = db.Column("id", db.Integer, primary_key=True)
#     lat = db.Column(db.Float, nullable=False)
#     lng = db.Column(db.Float, nullable=False)
#     # address field to implement google maps stuff
#     # name of the business

#     # One-to-many relationship to cats; deletes associated cats
#     # when the pin gets deleted
#     cats = db.relationship('cat', backref='pin', lazy=True, cascade="all, delete-orphan")

#     def __init__(self, lat, lng):
#         self.lat = lat
#         self.lng = lng

#     def __repr__(self):
#         return f"<Pin(id={self.id}, lat={self.lat}, lng={self.lng}, cats={[cat.id for cat in self.cats]})>"
    
    # def to_dict(self):
    #     # Convert SQLAlchemy model to a dictionary
    #     return {
    #         "id": self.id,
    #         "lat": self.lat,
    #         "lng": self.lng,
    #         "cats": [cat.id for cat in self.cats]
    #     }



@app.route('/cat', methods=['GET'])
def cat_logic():
    # retrieving the cats at specific id
    # return {'cats' : list(map(lambda x: x.to_dict(), cat.query.filter_by(pin_id=request.args.get('pin_id')).all()))}
    pin_id=request.args.get('pin_id')
    result = execute_query(f"SELECT * FROM cat where pin_id={pin_id}")
    cats = Cat.map_to_cat(result)
    return jsonify(cats)



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
        # pin_list = [p.to_dict() for p in db.session.query(pin).all()]
        # print(db.session.query(pin).all())
        # return {'pins': pin_list}
        result = execute_query()
        return execute_query("SELECT * FROM pin")


if __name__ == '__main__':
    with app.app_context():
        app.run(debug=True)