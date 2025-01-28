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


def read_query(query):
    mydb = connection_pool.get_connection()
    cursor = mydb.cursor()
    cursor.execute(query)
    rows = cursor.fetchall()
    mydb.close()
    return rows

def post_query(query):
    mydb = connection_pool.get_connection()
    cursor = mydb.cursor()
    cursor.execute(query)
    mydb.commit()
    
    last_inserted_id = cursor.lastrowid  # Retrieve the last inserted ID
    mydb.close()
    return last_inserted_id

def delete_query(query):
    mydb = connection_pool.get_connection()
    cursor = mydb.cursor()
    cursor.execute(query)
    mydb.commit()
    
    affected_rows = cursor.rowcount  # Get the number of rows affected by the DELETE query
    mydb.close()
    return affected_rows


@app.route('/')
def index():
    return read_query("SELECT * FROM cat")


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

class Pin(object):
    # One-to-many relationship to cats

    def __init__(self, id, lat, lng):
        self.id = id
        self.lat = lat
        self.lng = lng
        # maybe add later address field to implement google maps stuff
        # name of the business

    def __repr__(self):
        return f"<Pin(id={self.id}, lat={self.lat}, lng={self.lng})>"
    
    def to_dict(self):
        # Convert SQLAlchemy model to a dictionary
        return {
            "id": self.id,
            "lat": self.lat,
            "lng": self.lng,
        }
    
    def map_to_pin(rows):
        return [Pin(id=row[0], lat=row[1], lng=row[2]).to_dict() for row in rows]



@app.route('/cat', methods=['GET'])
def cat_logic():
    # retrieving the cats at specific id
    result = read_query(f"SELECT * FROM cat where pin_id={request.args.get('pin_id')}")
    cats = Cat.map_to_cat(result)
    return {'cats': cats}



@app.route('/pin', methods=['GET', 'POST', 'DELETE', 'PATCH'])
def pin_logic():
    # its easier to add the cats using patch
    if request.method == 'POST':
        # this method should create a new pin, and return an id
        lat = request.json.get('lat')
        lng = request.json.get('lng')
        query = f"INSERT INTO pin (lat, lng) VALUE ({lat}, {lng});"
        return {'id': post_query(query)}
    elif request.method == 'DELETE':
        id = request.json.get('id')
        # pin_to_delete = pin.query.filter_by(id=id).first()
        # db.session.delete(pin_to_delete)
        # db.session.commit()
        print(id)
        pin_query = f"DELETE FROM pin WHERE id={id};"
        cat_query = f"DELETE FROM cat WHERE pin_id={id}"
        num_cats_deleted = delete_query(cat_query)
        num_pins_deleted = delete_query(pin_query)
        return {"message": f"Pin {id} {'deleted successfuly' if num_pins_deleted > 0 else 'not deleted'}. Deleted {num_cats_deleted} cats :("}
    elif request.method == 'PATCH':
        # what can I do in a patch
        # start with create a new cat, TODO modify an existing cat, or delete one of the cats
        # 1. create a new cat
        cat_name = request.json.get('name')
        cat_desc = request.json.get('desc')
        pin_id = request.json.get('id')
        print(cat_name, cat_desc, pin_id)
        cat_query = f"INSERT INTO cat (name, `desc`, pin_id) VALUES ('{cat_name}', '{cat_desc}', {pin_id});"
        post_query(cat_query)

        result = read_query(f"SELECT * FROM cat where pin_id={pin_id}")
        all_cats = Cat.map_to_cat(result)

        # all_cats = list(map(lambda x: x.to_dict(), cat.query.filter_by(pin_id=pin_id).all()))
        return {'assoicated_cats': all_cats,
                'pin_id': pin_id
                }
    else:
        # default is GET
        result = read_query("SELECT * FROM pin")
        print(result)
        pins = Pin.map_to_pin(result)
        return {'pins': pins}


if __name__ == '__main__':
    with app.app_context():
        app.run(debug=True)