from flask import Flask, request
from flask_cors import CORS
from mysql.connector import pooling
import time
import boto3
from models import Cat, Pin, Photo, User, Queue
from dotenv import load_dotenv
import os
import uuid

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

@app.route('/cat', methods=['GET', 'DELETE', 'PATCH'])
def cat_logic():
    if request.method == 'GET':
        # retrieving the cats at specific id
        query = "SELECT * FROM cat WHERE pin_id = %s"
        pin_id = request.args.get('pin_id')
        if pin_id == 'all':
            result = read_query("SELECT * FROM cat")
        else:
            result = read_query(query, (pin_id,))
        cats = Cat.map_to_cat(result)
        return {'cats': cats}
    elif request.method == 'DELETE':
        pass
        # cat_query = "DELETE FROM cat WHERE id=%s"
        # photo_query = "DELETE FROM photo where cat_id=%s"
        # cat_id = request.args.get('cat_id')
        # num_photos_deleted = delete_query(photo_query, params=(cat_id,))
        # num_cats_deleted = delete_query(cat_query, params=(cat_id,))
        # return {'message': f"{num_cats_deleted} cats deleted and {num_photos_deleted} photos deleted"}
    elif request.method == 'PATCH':
        # current fields are name and desc
        pass
        #     field = request.json.get('fieldToUpdate')
        #     value = request.json.get('newValue')
        #     cat_id = request.json.get('cat_id')
        #     if field == 'desc':
        #         query = f"UPDATE cat SET `{field}` = %s WHERE id= %s"
        #     else:
        #         query = f"UPDATE cat SET {field} = %s WHERE id= %s"
        #     num_cats_updated = delete_query(query, params=(value, cat_id))
        #     return {'message': f"updated {num_cats_updated} cats"}
        # else: 
        #     return {'stub': 'else'}
        


# what fields do I need in order to allow  user to do a post
# I still need to upload the photo into s3 -> do the actual file upload
# and give me the id of the file
# I need the the cat name and description
# i need the user naame and I need the lng, lat
@app.route('/pin', methods=['GET', 'POST', 'DELETE', 'PATCH'])
def pin_logic():
    # its easier to add the cats using patch
    if request.method == 'POST':
        # this method should create a new pin, and return an id
        pass
        # lat = request.json.get('lat')
        # lng = request.json.get('lng')
        # username = request.json.get('username')

        # get_user_id = read_query("SELECT * FROM user where username = %s", params=(username,))
        # user_id = User.map_to_user(get_user_id)[0]['id']
        # query = "INSERT INTO pin (lat, lng, user_id) VALUE (%s, %s, %s);"

        # pin_id = post_query(query, params=(lat, lng, user_id))
        # print('pin_id', pin_id)

        # pin_info_query = "SELECT * FROM pin where id = %s"
        # get_all_info = read_query(pin_info_query, params=(pin_id,))
        # print('getting all the info')
        # print(get_all_info)
        # my_pin = Pin.map_to_pin(get_all_info)[0]

        # return {'id': my_pin['id'], 'user_id': my_pin['user_id'], 'created_at': my_pin['created_at']}
    elif request.method == 'DELETE':
        # id = request.json.get('id')
        # read the number cats before deleting
        pass
        # query = "SELECT count(*) FROM cat WHERE pin_id = %s"
        # num_cats = read_query(query, (id,))[0][0]
        # print(num_cats)
        # if num_cats > 0:
        #     return {'num_cats': num_cats}

        # pin_query = "DELETE FROM pin WHERE id=%s;"
        # cat_query = "DELETE FROM cat WHERE pin_id=%s"
        # num_cats_deleted = delete_query(cat_query, params=(id,))
        # num_pins_deleted = delete_query(pin_query, params=(id,))
        # return {"message": f"Pin {id} {'deleted successfuly' if num_pins_deleted > 0 else 'not deleted'}. Deleted {num_cats_deleted} cats :("}
    elif request.method == 'PATCH':
        # creates a new cat and associates it with a locatino 
        pass
        # cat_name = request.json.get('name')
        # cat_desc = request.json.get('desc')
        # pin_id = request.json.get('id')
        # print(cat_name, cat_desc, pin_id)
        # cat_query = "INSERT INTO cat (name, `desc`, pin_id) VALUES (%s, %s, %s);"
        # post_query(cat_query, params=(cat_name, cat_desc, pin_id))

        # updated_cats_query = "SELECT * FROM cat WHERE pin_id = %s"
        # result = read_query(updated_cats_query, params=(pin_id,))
        # all_cats = Cat.map_to_cat(result)

        # return {'assoicated_cats': all_cats,
        #         'pin_id': pin_id
        #         }
    else:
        # default is GET
        result = read_query("SELECT pin.id, pin.lat, pin.lng, pin.created_at, user.username FROM pin INNER JOIN user on pin.user_id = user.id")
        print('resssulTT')
        print(result)
        pins = Pin.map_to_pin(result)
        return {'pins': pins}
    
@app.route('/queue', methods=['POST', 'GET'])
def queue_logic():
    if request.method == 'GET':
        result = read_query("SELECT * FROM queue ORDER by created_at DESC")
        print('resssulTT')
        print(result)
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

@app.route('/photo', methods=['GET', 'POST', 'DELETE'])
def photo_logic():
    if request.method == 'POST':
        pass
        # file_name = request.json.get('file_name')
        # cat_id = request.json.get('cat_id')
        # insert_photo_query = "INSERT INTO photo (file_name, cat_id, awsuuid) VALUE (%s, %s, %s);"
        new_uuid = str(uuid.uuid4())
        # result = str(post_query(insert_photo_query, params=(file_name, cat_id, new_uuid)))
        return {'new_photo_id': new_uuid}
    elif request.method == 'GET':
        cat_id = request.args.get('cat_id')
        query = "SELECT * FROM photo WHERE cat_id = %s"
        result = read_query(query, (cat_id,))
        all_photos = Photo.map_to_photo(result)
        return {'photos': all_photos}
    else:
        # delete
        pass
        # photo_id = request.args.get('photo_id')
        # print(photo_id)
        # delete_photo_query = "DELETE FROM photo WHERE id = %s"
        # num_photos_deleted = delete_query(delete_photo_query, params=(photo_id,))
        # return {'num_photos_deleted': num_photos_deleted}




if __name__ == '__main__':
    with app.app_context():
        app.run(debug=True)