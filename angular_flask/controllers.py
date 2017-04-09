import os

from flask import Flask, request, Response, session, jsonify
from flask import render_template, url_for, redirect, send_from_directory
from flask import send_file, make_response, abort

from flask.ext.session import Session

from angular_flask import app

# routing for API endpoints, generated from the models designated as API_MODELS
from angular_flask.core import api_manager
from angular_flask.models import *

for model_name in app.config['API_MODELS']:
    model_class = app.config['API_MODELS'][model_name]
    api_manager.create_api(model_class, methods=['GET', 'POST'])

api_session = api_manager.session


# routing for basic pages (pass routing onto the Angular app)
@app.route('/')
@app.route('/about')
@app.route('/blog')
@app.route('/login')
def basic_pages(**kwargs):
    return make_response(open('angular_flask/templates/index.html').read())


# routing for CRUD-style endpoints
# passes routing onto the angular frontend if the requested resource exists
from sqlalchemy.sql import exists

crud_url_models = app.config['CRUD_URL_MODELS']


@app.route('/<model_name>/')
@app.route('/<model_name>/<item_id>')
def rest_pages(model_name, item_id=None):
    if session.get('logged_in') is True:
        if model_name in crud_url_models:
            model_class = crud_url_models[model_name]
            print "querying " + model_name
            print model_class
            print model_class.__dict__
            if item_id is None or api_session.query(exists().where(
                    model_class.CourseID == item_id)).scalar():
                return make_response(open(
                    'angular_flask/templates/index.html').read())
    abort(404)

@app.route('/api/login', methods=['POST', 'GET'])
def login():
    if request.method == 'POST':

        json_data = request.get_json()
        print "JSON DATA ====\n\n"
        print json_data
        user = User.query.filter_by(login=json_data['username']).first()
        if user and user.password in json_data['password']:
            session['logged_in'] = True
            status = True
        else:
            status = False
        return jsonify({'result': status})
    else:
        return render_template('login.html')

@app.route('/_session')
def get_from_session():
    key = request.args['key']
    print session.get(key)
    return str(session.get(key))

# special file handlers and error handlers
@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'img/favicon.ico')


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404
