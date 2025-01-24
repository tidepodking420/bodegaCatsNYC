#!/bin/bash

# Build the React app
echo "Building React app..."
cd front-end
npm run build
cd ..

# Move React build files to Flask
echo "Moving React files to Flask..."
cp front-end/dist/assets/*.js flask_app/static/assets/
cp front-end/dist/assets/*.css flask_app/static/assets/
mkdir flask_app/templates
cp front-end/dist/index.html flask_app/templates/

# Deployment
pip install -r flask_app/requirements.txt
python3 flask_app/server.py

