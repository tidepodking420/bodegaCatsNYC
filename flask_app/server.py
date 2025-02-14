from flask import Flask, request
from flask_cors import CORS
from mysql.connector import pooling
import time
import boto3
from models import Cat, Pin, Photo, User, Queue
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)
app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST')
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB')

# AWS S3 credentials and bucket name
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
BUCKET_NAME = os.getenv('BUCKET_NAME')

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
    pool_size=10,
    host=app.config['MYSQL_HOST'],
    user=app.config['MYSQL_USER'],
    password=app.config['MYSQL_PASSWORD'],
    database=app.config['MYSQL_DB']
)

connection_pool = get_db_connection()

def update_query(query, params=()):
    mydb = connection_pool.get_connection()
    cursor = mydb.cursor()
    cursor.execute(query, params)
    mydb.commit()
    
    rows_affected = cursor.rowcount  # Retrieve the number of rows affected by the update
    mydb.close()
    return rows_affected


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

@app.route('/cat', methods=['GET'])
def cat_logic():
    if request.method == 'GET':
        # retrieving the cats at specific id
        query = "SELECT cat.id, cat.name, cat.`desc`, cat.pin_id, user.username, pin.created_at FROM cat INNER JOIN pin ON cat.pin_id=pin.id INNER JOIN user ON pin.user_id=user.id"
        pin_id = request.args.get('pin_id')
        if pin_id == 'all':
            result = read_query(query)
        else:
            result = read_query(query + " WHERE pin_id = %s", (pin_id,))
        cats = Cat.map_to_cat(result)

        return {'cats': cats}
        

@app.route('/pin', methods=['GET'])
def pin_logic():
    # default is GET
    result = read_query("SELECT pin.id, pin.lat, pin.lng, pin.created_at, user.username FROM pin INNER JOIN user on pin.user_id = user.id")
    print('resssulTT')
    print(result)
    pins = Pin.map_to_pin(result)
    return {'pins': pins}
    
@app.route('/queue', methods=['POST', 'GET', 'PATCH'])
def queue_logic():
    if request.method == 'GET':
        print('username', request.args.get('username'))
        username = request.args.get('username')
        if username:
            result = read_query("SELECT * FROM queue WHERE username = %s ORDER by created_at DESC", params=(username,))
        else:
            result = read_query("SELECT * FROM queue WHERE decision = 'pending' ORDER by created_at DESC")
        
        queues = Queue.map_to_queue(result)
        return {'queue': queues}
    if request.method == 'POST':
        lng = request.json.get('lng')
        lat = request.json.get('lat')
        username = request.json.get('username')
        catName = request.json.get('catName')
        catDesc = request.json.get('catDesc')
        awsuuid = request.json.get('awsuuid')

        print(lng, lat, username, catName, catDesc, awsuuid)
        if not len(awsuuid):
            return {'message': 'You must add a photo'}
        if len(catName) > 50:
            return {'message': 'Name cannot exceed 50 characters'}
        if not len(catName):
            return {'message': 'You must include a name or check the box'}
        if not len(catDesc):
            return {'message': 'You must include a description'}
        if len(catDesc) > 240:
            return {'message': 'Description cannot exceeed 240 characters'}
        if int(lat) == int(lng):
            return {'message': 'Add a pin on the map please.'}

        insert_into_query_table = "INSERT INTO queue (lat, lng, catName, catDesc, username, awsuuid) VALUE (%s, %s, %s, %s, %s, %s);"
        insertion_result = post_query(insert_into_query_table, params=(lat, lng, catName, catDesc, username, awsuuid))
        print(insertion_result)

        return {'message': 'success'}
    if request.method == 'PATCH':
        queue_id = request.json.get('queue_id')
        selection = request.json.get('selection')
        username = request.json.get('username')
        lat = request.json.get('lat')
        lng = request.json.get('lng')
        cat_name = request.json.get('catName')
        cat_desc = request.json.get('catDesc')
        awsuuid = request.json.get('awsuuid')

        update_sql = "UPDATE queue SET decision = %s WHERE id = %s"
        if selection == 'accept':

            get_user_id = read_query("SELECT * FROM user where username = %s", params=(username,))
            user_id = User.map_to_user(get_user_id)[0]['id']

            pin_insert_query = "INSERT INTO pin (lat, lng, user_id) VALUE (%s, %s, %s);"
            pin_id = post_query(pin_insert_query, params=(lat, lng, user_id))

            cat_query = "INSERT INTO cat (name, `desc`, pin_id) VALUES (%s, %s, %s);"
            cat_id = post_query(cat_query, params=(cat_name, cat_desc, pin_id))

            file_name = 'file_name'
            insert_photo_query = "INSERT INTO photo (file_name, cat_id, awsuuid) VALUE (%s, %s, %s);"
            final_result = post_query(insert_photo_query, params=(file_name, cat_id, awsuuid))
            print(final_result)

            decision = 'accepted'

            post_query(update_sql, params=(decision, queue_id))
            return {'message' : 'suceess'}
        else:
            decision = 'rejected'
            post_query(update_sql, params=(decision, queue_id))
            return {'message': 'success'}


@app.route('/login', methods=['POST', 'PATCH'])
def login_logic():
    username = request.json.get('username')
    password = request.json.get('password')
    # check if that username exists in the database

    # if it does not exist, then return error
    # if it does exist, verify password

    query_username = "SELECT * FROM user where BINARY username = %s"
    result = read_query(query_username, params=(username,))
    user_obj = User.map_to_user(result)
    print(user_obj)
    if request.method == 'POST':
        if not len(user_obj):
            return {'message': 'no-such-user'}
        
        print()
        if user_obj[0]['password_hash'] == password:
            return {'message': 'successful-login'}
        else:
            return  {'message': 'bad-password'}
    else:
        # PATCH
        # registering a new user

        email = request.json.get('email')
        if len(username) < 5:
            return {'message': 'Username must be at least 5 characters'}
        if len(username) > 50:
            return {'message': 'Username cannot exceed 50 characters'}
        if len(user_obj):
            return {'message': f"{username} is already an existing user"}
        if len(password) < 5:
            return {'message': 'Password must be at least 5 characters '}
        if len(password) > 255:
            return {'message': 'Password cannot exceed 255 characters'}
        if len(email) < 1 or len(email) > 100:
            return {'message': 'Invalid Email'}
        
          # do not allow re-using an email
        query_email = "SELECT * FROM user where BINARY email = %s"
        result = read_query(query_email, params=(email,))
        email_obj = User.map_to_user(result)
        if len(email_obj):
            return {'message': f"Email {email} already in Use"}

        
        insert_user_query = "INSERT INTO user (username, email, password_hash, user_role) VALUE (%s, %s, %s, 'user');"
        result = post_query(insert_user_query, params=(username, email, password))
        print(result)
        return {'message': 'success'}

@app.route('/photo', methods=['GET'])
def photo_logic():
    cat_id = request.args.get('cat_id')
    query = "SELECT * FROM photo WHERE cat_id = %s"
    result = read_query(query, (cat_id,))
    all_photos = Photo.map_to_photo(result)
    return {'photos': all_photos}
   



if __name__ == '__main__':
    with app.app_context():
        app.run(debug=True)