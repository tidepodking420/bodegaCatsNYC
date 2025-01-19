from flask import Flask
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
api_key_path='/home/user/vscode/secrets.txt'

@app.route('/api_key/map_tiler')
def home():
    with open(api_key_path, 'r') as file:
        first_line = file.readline()
        api_secret = first_line[first_line.index('=') + 1:len(first_line) - 1]
        return {'map_tiler': api_secret}

if __name__ == '__main__':
    app.run(debug=True)