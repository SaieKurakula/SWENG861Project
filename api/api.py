import time
import requests
import json
from flask import Flask
from flask import jsonify

app = Flask(__name__)

@app.route('/time')
def get_current_time():

    info = requests.get('http://theaudiodb.com/api/v1/json/1/search.php?s=coldplay')
    return json.dumps(info.text)
