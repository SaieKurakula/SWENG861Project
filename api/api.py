import time
import requests
import json
from flask import Flask, request
from flask import jsonify

app = Flask(__name__)

@app.route('/artist')
def get_artist():
    artist = request.args['artist']
    info = requests.get('http://theaudiodb.com/api/v1/json/1/search.php?s=' + artist)
    artistInfo = {}
    artistInfo = json.loads(info.text)['artists'][0]

    otherLangBios = ['strBiographyFR', 'strBiographyCN', 'strBiographyPT', 'strBiographyIT',
                    'strBiographyJP', 'strBiographyRU', 'strBiographyES', 'strBiographyNL',
                    'strBiographyHU', 'strBiographyDE', 'strBiographySE', 'strBiographyNO']

    newArtistInfoDict = {}

    for k,v in artistInfo.items():
        if k not in otherLangBios:
            newArtistInfoDict[k] = v
    
    return json.dumps(newArtistInfoDict)

@app.route('/song')
def get_song():
    song = request.args['song']
    info = requests.get('http://ws.audioscrobbler.com/2.0/?method=track.search&track='+song+'&api_key=04c2af395292148ea292ff1fee738746&format=json')
    tracksFull =json.loads(info.text)['results']['trackmatches']['track']
    tracks = {}

    for track in tracksFull:
        tracks[track['artist']] = track['name']

    return json.dumps(tracks)

@app.route('/artistsong')
def get_artist_song():
    artist = request.args['artist']
    song = request.args['song']
    info = requests.get('http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=04c2af395292148ea292ff1fee738746&artist='+artist+'&track='+song+'&format=json')
    return json.dumps(info.text)
