import os

from flask import Flask, request, Response, session, jsonify
from flask import render_template, url_for, redirect, send_from_directory
from flask import send_file, make_response, abort

from flask.ext.session import Session

from angular_flask import app

# routing for API endpoints, generated from the models designated as API_MODELS
from angular_flask.core import api_manager
from angular_flask.models import *

from flask.json import JSONEncoder

class CustomJSONEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, User):
            # Implement code to convert Passport object to a dict
            user_dict = {
                'UserID': obj.UserID,
                'login': obj.login,
                'FirstName': obj.FirstName,
                'LastName': obj.LastName,
                'userType': obj.userType
            }
            return user_dict
        else:
            JSONEncoder.default(self, obj)

# Now tell Flask to use the custom class
app.json_encoder = CustomJSONEncoder

for model_name in app.config['API_MODELS']:
    model_class = app.config['API_MODELS'][model_name]
    api_manager.create_api(model_class, methods=['GET', 'POST'])

api_session = api_manager.session


# routing for basic pages (pass routing onto the Angular app)
@app.route('/')
@app.route('/about')
@app.route('/blog')
@app.route('/login')
@app.route('/admin')
@app.route('/course')
@app.route('/course/<course_id>')
@app.route('/home')
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
        print "controllers.py - /api/route POST : JSON DATA ====\n\n"
        print json_data
        user = User.query.filter_by(login=json_data['username']).first()
        print user
        #do hashing here
        if user and user.password in json_data['password']:
            session['logged_in'] = user
            status = True
        else:
            session['logged_in'] = None
            status = False
        return jsonify({
            'result': status,
            'user': session['logged_in']
        })
    else:
        return render_template('login.html')

@app.route('/api/user/', methods=['GET'])
def get_users():
    users = User.query.all()
    return str(users)

@app.route('/api/user/create', methods=['POST'])
def create_user():
    json_data = request.get_json()
    print "controllers.py - /api/user/create POST : JSON DATA ====\n\n"
    print json_data
    new_user = User(None, json_data['username'], json_data['password'], json_data['userType'])
    try:
        db.session.add(new_user)
        db.session.commit()

        inserted_user = User.query.filter(User.login == json_data['username']).all()[0]
        print inserted_user
        if json_data['userType'] == 'student':
            new_student = Student(None, inserted_user.UserID)
            db.session.add(new_student)
            db.session.commit()
    except Exception as e:
        print "probably duplicate login: " + str(e)

    return render_template('index.html')

@app.route('/api/user/<user_id>/course', methods=['GET'])
def get_enrolled_courses(user_id):
    courses = []
    print "controllers.py - getting enrolled courses"
    student = Student.query.filter(Student.UserID == user_id).all()[0]
    enrolled_courses = Enrolment.query.filter(Enrolment.StudentID == student.StudentID).all()
    for enrolment in enrolled_courses:
        print 'student ' + str(student.StudentID) + ' enrolled in ' + str(enrolment)
        course = Course.query.filter(Course.CourseID == enrolment.CourseID).all()[0];
        courses.append(course)
    return str(courses)

@app.route('/api/user/<user_id>/unenrolled', methods=['GET'])
def get_not_enrolled_courses(user_id):
    courses = []
    print "controllers.py - getting not enrolled courses"
    student = Student.query.filter(Student.UserID == user_id).all()[0]
    enrolled_courses = Enrolment.query.filter(Enrolment.StudentID == student.StudentID).all()
    for enrolment in enrolled_courses:
        course = Course.query.filter(Course.CourseID == enrolment.CourseID).all()[0];
        courses.append(course.CourseID)
    all_courses = Course.query.all()
    all_courses_iter = all_courses
    for course in all_courses_iter[:]:
        if course.CourseID in courses:
            all_courses.remove(course)
    print "THESE ARE THE COURSES YOURE NOT ENROLLED IN"
    print str(all_courses)
    return str(all_courses)


@app.route('/api/course/', methods=['GET'])
def get_courses():
    courses = Course.query.all()
    return str(courses)

@app.route('/api/course/create', methods=['POST'])
def create_course():
    json_data = request.get_json()
    print "controllers.py - /api/user/create POST : JSON DATA ====\n\n"
    print json_data
    new_course = Course(None, json_data['title'], json_data['description'], json_data['category'])
    db.session.add(new_course)
    db.session.commit()
    return render_template('index.html')


#enrol with currently logged in user
@app.route('/api/course/<courseid>/enrol', methods=['POST', 'GET'])
def enrol(courseid):
    print "enrol endpoint query"
    student = Student.query.filter(Student.UserID == session['logged_in']['UserID']).all()[0]
    if request.method == 'POST':
        print "controllers.py - /api/course/%s/enrol POST" % str(courseid)
        print session['logged_in']
        new_enrolment = Enrolment(student.StudentID, int(courseid), 'enrolled')
        db.session.add(new_enrolment)
        db.session.commit()
        return "OK"
    else:
        print "controllers.py - /api/course/%s/enrol GET" % str(courseid)
        enrolment = Enrolment.query\
            .filter(Enrolment.StudentID == student.StudentID)\
            .filter(Enrolment.CourseID == courseid).all()
        return str(len(enrolment) > 0)

@app.route('/api/course/<courseid>/unenrol', methods=['POST', 'GET'])
def unenrol(courseid):
    student = Student.query.filter(Student.UserID == session['logged_in']['UserID']).all()[0]
    if request.method == 'POST':
        new_enrolment = Enrolment.query\
            .filter(Enrolment.StudentID == student.StudentID)\
            .filter(Enrolment.CourseID == int(courseid)).first()
        print new_enrolment
        db.session.delete(new_enrolment)
        db.session.commit()
    return "OK"


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
