from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from mysql.connector import pooling
import time
import boto3
from io import BytesIO

app = Flask(__name__)
CORS(app)
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'password'
app.config['MYSQL_DB'] = 'cat_app'

# AWS S3 credentials and bucket name
AWS_ACCESS_KEY_ID = 'AKIA2CUNLWDYSNUCDVM4'
AWS_SECRET_ACCESS_KEY = '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'
BUCKET_NAME = 'catapp'

# Initialize the S3 client
s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY
)

def get_db_connection():
    time.sleep(5)
    # Function to get a database connection
    return pooling.MySQLConnectionPool(
    pool_name="Swimming_Pools_Drank",
    pool_size=5,
    host=app.config['MYSQL_HOST'],
    user=app.config['MYSQL_USER'],
    password=app.config['MYSQL_PASSWORD'],
    database=app.config['MYSQL_DB']
)

connection_pool = get_db_connection()


def read_query(query, params=()):
    mydb = connection_pool.get_connection()
    cursor = mydb.cursor()
    cursor.execute(query, params)
    rows = cursor.fetchall()
    mydb.close()
    return rows

def post_query(query, params=()):
    mydb = connection_pool.get_connection()
    cursor = mydb.cursor()
    cursor.execute(query, params)
    mydb.commit()
    
    last_inserted_id = cursor.lastrowid  # Retrieve the last inserted ID
    mydb.close()
    return last_inserted_id

def delete_query(query, params=()):
    mydb = connection_pool.get_connection()
    cursor = mydb.cursor()
    cursor.execute(query, params)
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


@app.route('/cat', methods=['GET', 'DELETE', 'PATCH'])
def cat_logic():
    if request.method == 'GET':
        # retrieving the cats at specific id
        query = "SELECT * FROM cat WHERE pin_id = %s"
        pin_id = request.args.get('pin_id')
        result = read_query(query, (pin_id,))
        cats = Cat.map_to_cat(result)
        return {'cats': cats}
    elif request.method == 'DELETE':
        query = "DELETE FROM cat WHERE id=%s"
        cat_id = request.args.get('cat_id')
        num_cats_deleted = delete_query(query, params=(cat_id,))
        return {'message': f"{num_cats_deleted} cats deleted"}
    elif request.method == 'PATCH':
        # current fields are name and desc
        field = request.json.get('fieldToUpdate')
        value = request.json.get('newValue')
        cat_id = request.json.get('cat_id')
        if field == 'desc':
            query = f"UPDATE cat SET `{field}` = %s WHERE id= %s"
        else:
            query = f"UPDATE cat SET {field} = %s WHERE id= %s"
        num_cats_updated = delete_query(query, params=(value, cat_id))
        return {'message': f"updated {num_cats_updated} cats"}
    else: 
        return {'stub': 'else'}
        



@app.route('/pin', methods=['GET', 'POST', 'DELETE', 'PATCH'])
def pin_logic():
    # its easier to add the cats using patch
    if request.method == 'POST':
        # this method should create a new pin, and return an id
        lat = request.json.get('lat')
        lng = request.json.get('lng')
        query = "INSERT INTO pin (lat, lng) VALUE (%s, %s);"
        return {'id': post_query(query, params=(lat, lng))}
    elif request.method == 'DELETE':
        id = request.json.get('id')
        pin_query = "DELETE FROM pin WHERE id=%s;"
        cat_query = "DELETE FROM cat WHERE pin_id=%s"
        num_cats_deleted = delete_query(cat_query, params=(id,))
        num_pins_deleted = delete_query(pin_query, params=(id,))
        return {"message": f"Pin {id} {'deleted successfuly' if num_pins_deleted > 0 else 'not deleted'}. Deleted {num_cats_deleted} cats :("}
    elif request.method == 'PATCH':
        # creates a new cat and associates it with a locatino 
        cat_name = request.json.get('name')
        cat_desc = request.json.get('desc')
        pin_id = request.json.get('id')
        print(cat_name, cat_desc, pin_id)
        cat_query = "INSERT INTO cat (name, `desc`, pin_id) VALUES (%s, %s, %s);"
        post_query(cat_query, params=(cat_name, cat_desc, pin_id))

        updated_cats_query = "SELECT * FROM cat WHERE pin_id = %s"
        result = read_query(updated_cats_query, params=(pin_id,))
        all_cats = Cat.map_to_cat(result)

        return {'assoicated_cats': all_cats,
                'pin_id': pin_id
                }
    else:
        # default is GET
        result = read_query("SELECT * FROM pin")
        print(result)
        pins = Pin.map_to_pin(result)
        return {'pins': pins}
    
@app.route('/download/<filename>')
def download_file(filename):
    try:
        print(filename)
        # Retrieve the file from S3
        file_obj = s3_client.get_object(Bucket=BUCKET_NAME, Key=filename)
        print('file_obj', file_obj)
        file_content = file_obj['Body'].read()
        print('file_content', file_content)
        
        # Send the file to the client
        return send_file(
            BytesIO(file_content),
            as_attachment=True,
            download_name=filename
        )
    except Exception as e:
        return str(e), 404
    
# CREATE TABLE photo (
#     id INT AUTO_INCREMENT PRIMARY KEY,
#     file_name VARCHAR(50) NOT NULL,
#     cat_id INT NOT NULL,
#     FOREIGN KEY (cat_id) REFERENCES cat(id)
# );
@app.route('/photo', methods=['POST'])
def photo_logic():
    file_name = request.json.get('file_name')
    cat_id = request.json.get('cat_id')
    insert_photo_query = "INSERT INTO photo (file_name, cat_id) VALUE (%s, %s);"
    return {'new_photo_id': str(post_query(insert_photo_query, params=(file_name, cat_id)))}



if __name__ == '__main__':
    with app.app_context():
        app.run(debug=True)