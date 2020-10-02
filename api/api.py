import time
import requests
import json
from flask import Flask, request
from flask import jsonify

app = Flask(__name__)

@app.route('/artist')
def get_artist():
    artist = request.args['artist']
    try:
        info = requests.get('http://theaudiodb.com/api/v1/json/1/search.php?s=' + artist)
        info.raise_for_status()
    except requests.exceptions.HTTPError as err:
        return json.dumps({'error':err})

    if json.loads(info.text)['artists'] is not None:
        try:
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
        except:
            return json.dumps({'error':sys.exc_info()[0]})
    else:
        return json.dumps({'error':'Artist Not Found'})

@app.route('/song')
def get_song():
    song = request.args['song']
    try:
        info = requests.get('http://ws.audioscrobbler.com/2.0/?method=track.search&track='+song+'&api_key=04c2af395292148ea292ff1fee738746&format=json')
        info.raise_for_status()
    except requests.exceptions.HTTPError as err:
        return json.dumps({'error':err})

    if len(json.loads(info.text)['results']['trackmatches']['track']) >= 1:
        try:
            tracksFull =json.loads(info.text)['results']['trackmatches']['track']
            tracks = {}

            for track in tracksFull:
                if track['artist'].isascii() and track['name'].isascii():
                    tracks[track['artist']] = track['name']

            return json.dumps(tracks)
        except:
            return json.dumps({'error':sys.exc_info()[0]})
    else:
        return json.dumps({'error':'Song not found'})


@app.route('/artistsong')
def get_artist_song():
    arst = request.args['artist']
    sng = request.args['song']
    try:
        info = requests.get('http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=04c2af395292148ea292ff1fee738746&artist='+arst+'&track='+sng+'&format=json')
        info.raise_for_status()
    except requests.exceptions.HTTPError as err:
        return json.dumps({'error':err})

    if 'error' not in json.loads(info.text):
        try:
            songInfo = json.loads(info.text)['track']

            if 'streamable' in songInfo:
                del songInfo['streamable']
            if 'toptags' in songInfo:
                del songInfo['toptags']

            if 'artist' in songInfo:
                if 'name' in songInfo['artist']:
                    songInfo['artistName'] = songInfo['artist']['name']
                if 'url' in songInfo['artist']:
                    songInfo['artistURL'] =  songInfo['artist']['url']
                del songInfo['artist']

            if 'album' in songInfo:
                if 'title' in songInfo['album']:
                    songInfo['albumTitle'] = songInfo['album']['title']
                if 'url' in songInfo['album']:
                    songInfo['albumURL'] =  songInfo['album']['url']
                del songInfo['album']

            if 'wiki' in songInfo:
                if 'summary' in songInfo['wiki']:
                    songInfo['wikiSummary'] =  songInfo['wiki']['summary']
                del songInfo['wiki']

            return json.dumps(songInfo)
        except:
            return json.dumps({'error':sys.exc_info()[0]})
    else:
        return json.dumps({'error':'Track \'' + sng + '\' by '+arst+' not found'})

