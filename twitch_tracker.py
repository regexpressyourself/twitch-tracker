#!flask/bin/python
from flask import Flask, request, send_from_directory, \
        jsonify, make_response, redirect, send_file
import os
import json
import requests

app = Flask(__name__)

# Scaffolding
if __name__ == '__main__':
    app.run(debug=True)

# Routes

@app.route('/')
def index():
    return send_file('index.html')

@app.route('/main.css')
def css_file():
    return send_file('main.css')

@app.route('/main.js')
def js_file():
    return send_file('main.js')

@app.route('/get_viewers', methods=['GET'])
def get_current_data():
    username = "sscait"

    if request.args and len(request.args["username"]) > 0:
        username = request.args["username"]
        print("WE GOT A USERNAME!!")
    else:
        print("we didnt")

    print("============================");
    print(username);
    print("============================");
    response = requests.get("https://tmi.twitch.tv/group/user/"+username+"/chatters")
    return json.dumps(response.text)


@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found, yo'}), 404)

