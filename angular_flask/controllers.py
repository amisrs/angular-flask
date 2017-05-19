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
@app.route('/course')
@app.route('/course/<course_id>')
@app.route('/home')
@app.route('/students')
@app.route('/student/<student_id>')
@app.route('/register')
@app.route('/project/<project_id>')

def basic_pages(**kwargs):
    return make_response(open('angular_flask/templates/index.html').read())

@app.route('/project')
def sponsor_pages(**kwargs):
    if session['logged_in']['userType'] == 'sponsor':
        return make_response(open('angular_flask/templates/index.html').read())
    else:
        return redirect('/home')

@app.route('/admin')
@app.route('/admin/create_user')
def admin_pages(**kwargs):
    if session['logged_in']['userType'] == 'admin':
        return make_response(open('angular_flask/templates/index.html').read())
    else:
        return redirect('/')
# routing for CRUD-style endpoints
# passes routing onto the angular frontend if the requested resource exists
from sqlalchemy.sql import exists

crud_url_models = app.config['CRUD_URL_MODELS']


# @app.route('/<model_name>/')
# @app.route('/<model_name>/<item_id>')
# def rest_pages(model_name, item_id=None):
#     if session.get('logged_in') is True:
#         if model_name in crud_url_models:
#             model_class = crud_url_models[model_name]
#             print "querying " + model_name
#             print model_class
#             print model_class.__dict__
#             if item_id is None or api_session.query(exists().where(
#                     model_class.CourseID == item_id)).scalar():
#                 return make_response(open(
#                     'angular_flask/templates/index.html').read())
#     abort(404)



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
    if 'logged_in' in session:
        creator = session['logged_in']
        if creator['userType'] == 'supervisor':
            supervisor = Supervisor.query.filter(Supervisor.UserID == creator['UserID']).all()[0]


    json_data = request.get_json()
    print "controllers.py - /api/user/create POST : JSON DATA ====\n\n"
    print json_data
    existing_user = User.query.filter_by(login=json_data['username']).first()
    if existing_user:
        return "User exists"

    FirstName = ''
    LastName = ''
    if 'FirstName' in json_data:
        FirstName = json_data['FirstName']
    if 'LastName' in json_data:
        LastName = json_data['LastName']

    new_user = User(None, json_data['username'], json_data['password'], json_data['userType'], FirstName, LastName)
    try:
        db.session.add(new_user)
        db.session.commit()
        print "USER CREATED OK"
        inserted_user = User.query.filter(User.login == json_data['username']).all()[0]
        print inserted_user
        if json_data['userType'] == 'student':
            new_student = Student(None, inserted_user.UserID, supervisor.SupervisorID)
            db.session.add(new_student)
            db.session.commit()
        elif json_data['userType'] == 'supervisor':
            new_supervisor = Supervisor(None, inserted_user.UserID)
            db.session.add(new_supervisor)
            db.session.commit()
        elif json_data['userType'] == 'admin':
            new_admin = Admin(None, inserted_user.UserID)
            db.session.add(new_admin)
            db.session.commit()
        elif json_data['userType'] == 'sponsor':
            new_sponsor = Sponsor(None, inserted_user.UserID)
            db.session.add(new_sponsor)
            db.session.commit()
    except Exception as e:
        print "probably duplicate login: " + str(e)

    return "OK"

# probably change these to /api/student
@app.route('/api/user/<user_id>/course', methods=['GET'])
def get_enrolled_courses(user_id):
    result = []
    ongoing_courses = []
    completed_courses = []

    print "controllers.py - getting enrolled courses"
    student = Student.query.filter(Student.UserID == user_id).all()[0]
    enrolled_courses = Enrolment.query.filter(Enrolment.StudentID == student.StudentID).all()
    for enrolment in enrolled_courses:
        print 'student ' + str(student.StudentID) + ' enrolled in ' + str(enrolment)
        course = Course.query.filter(Course.CourseID == enrolment.CourseID).all()[0];

        if enrolment.status != 'completed':
            ongoing_courses.append(course)
        else:
            completed_courses.append(course)
    result.append(ongoing_courses)
    result.append(completed_courses)
    return str(result)

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

@app.route('/api/user/<user_id>/student', methods=['GET'])
def get_student_by_user(user_id):
    joined_item = {}

    student_join = db.session.query(User, Student).join(Student)\
        .filter(Student.UserID == user_id).all()

    print student_join
    for (user, student) in student_join:
        joined_item['StudentID'] = student.StudentID
        joined_item['FirstName'] = user.FirstName
        joined_item['LastName'] = user.LastName
        joined_item['UserID'] = user.UserID
        joined_item['login'] = user.login
    # print "JOINED ITEM: " + json.dumps(student_join)

    print str(joined_item)
    return json.dumps(joined_item), 200, {'Content-Type': 'application/json; charset=utf-8'}

@app.route('/api/user/<user_id>/sponsor', methods=['GET'])
def get_sponsor_by_user(user_id):
    joined_item = {}

    sponsor_join = db.session.query(User, Sponsor).join(Sponsor)\
        .filter(Sponsor.UserID == user_id).all()

    print sponsor_join
    for (user, sponsor) in sponsor_join:
        joined_item['SponsorID'] = sponsor.SponsorID
        joined_item['FirstName'] = user.FirstName
        joined_item['LastName'] = user.LastName
        joined_item['UserID'] = user.UserID
        joined_item['login'] = user.login
    # print "JOINED ITEM: " + json.dumps(student_join)

    print str(joined_item)
    return json.dumps(joined_item), 200, {'Content-Type': 'application/json; charset=utf-8'}


@app.route('/api/students/<student_id>', methods=['GET'])
def get_student_by_id(student_id):
    print "trigger api student"
    # print "api student: " + str(student)
    joined_item = {}

    student_join = db.session.query(User, Student).join(Student)\
        .filter(Student.StudentID == student_id).all()

    print student_join
    for (user, student) in student_join:
        joined_item['StudentID'] = student.StudentID
        joined_item['FirstName'] = user.FirstName
        joined_item['LastName'] = user.LastName
        joined_item['UserID'] = user.UserID
        joined_item['login'] = user.login
    # print "JOINED ITEM: " + json.dumps(student_join)

    print str(joined_item)
    return json.dumps(joined_item), 200, {'Content-Type': 'application/json; charset=utf-8'}

    #return jsonify(student)

@app.route('/api/student/<student_id>/project', methods=['GET'])
def get_accepted_projects(student_id):
    result = []
    my_projects = []
    print "student_id: " + str(student_id)
    student = Student.query.filter(Student.StudentID == student_id).all()[0]
    accepted_projects = Application.query.filter(Application.StudentID == student.StudentID).all()
    for application in accepted_projects:
        print 'student ' + str(student.StudentID) + ' accepted in ' + str(application)
        project = Project.query.filter(Project.ProjectID == application.ProjectID).all()[0];
        my_projects.append(project)
    result.append(my_projects)

    all_projects = Project.query.all()
    other_projects = []
    for proj in all_projects:
        if proj not in my_projects:
            other_projects.append(proj)
    result.append(other_projects)

    return str(result)

#return a list of students for this supervisor
@app.route('/api/supervisor/<user_id>/student', methods=['GET'])
def get_supervisor_students(user_id):
    students = []
    supervisor = Supervisor.query.filter(Supervisor.UserID == user_id).all()[0]
    students = db.session.query(User).join(Student).filter(Student.SupervisorID == supervisor.SupervisorID).all()
    print str(students)
    return str(students)

@app.route('/api/course/', methods=['GET'])
def get_courses():
    courses = Course.query.all()
    return str(courses)

@app.route('/api/course/category', methods=['GET'])
def get_categories():
    resp = {}
    categories = []
    query = db.session.query(Course.category.distinct().label("category"))
    for row in query.all():
        categories.append(row.category.encode('utf-8'))
    resp['cat_list'] = categories
    print str(categories)
    return jsonify(resp)


@app.route('/api/course/create', methods=['POST'])
def create_course():
    json_data = request.get_json()
    print "controllers.py - /api/user/create POST : JSON DATA ====\n\n"
    print json_data
    new_course = Course(None, json_data['title'], json_data['description'], json_data['category'], json_data['header_image'], json_data['content'])
    db.session.add(new_course)
    db.session.commit()
    return render_template('index.html')


@app.route('/api/course/<courseid>/complete', methods=['POST', 'GET'])
def complete(courseid):
    student = Student.query.filter(Student.UserID == session['logged_in']['UserID']).all()[0]
    if request.method == 'POST':
        enrolment = Enrolment.query\
            .filter(Enrolment.StudentID == student.StudentID)\
            .filter(Enrolment.CourseID == int(courseid)).first()
        enrolment.status = 'completed'
        db.session.commit()
    return "OK"

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
            .filter(Enrolment.CourseID == courseid).first()
        return str(enrolment)

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

@app.route('/api/sponsor/<sponsor_id>/project', methods=['GET'])
def get_sponsor_projects(sponsor_id):
    projects = Project.query.filter(Project.SponsorID == sponsor_id).all()
    print str(projects)
    return str(projects)

@app.route('/api/project/', methods=['GET'])
def get_projects():
    projects = Project.query.all()
    print str(projects)
    return str(projects)

@app.route('/api/project/category', methods=['GET'])
def get_project_categories():
    resp = {}
    categories = []
    query = db.session.query(Project.category.distinct().label("category"))
    for row in query.all():
        categories.append(row.category.encode('utf-8'))
    resp['cat_list'] = categories
    print str(categories)
    return jsonify(resp)

@app.route('/api/project/create', methods=['POST'])
def create_project():
    json_data = request.get_json()
    print "controllers.py - /api/project/create POST : JSON DATA ====\n\n"
    print json_data
    if 'logged_in' in session:
        creator = session['logged_in']
        if creator['userType'] == 'sponsor':
            sponsor = Sponsor.query.filter(Sponsor.UserID == creator['UserID']).all()[0]
        else:
            return "Incorrect user type."
    else:
        return "Not logged in."
    new_project = Project(None, sponsor.SponsorID, None, json_data['title'], json_data['description'], json_data['category'], 'open', json_data['deliverables'], json_data['requirements'], json_data['payment'])
    db.session.add(new_project)
    db.session.commit()
    return "OK"


@app.route('/api/project/<project_id>', methods=['GET'])
def get_project(project_id):
    project = Project.query.filter(Project.ProjectID == project_id).all()[0]
    print str(project)
    return str(project)

#enrol with currently logged in user
@app.route('/api/project/<project_id>/apply', methods=['POST', 'GET'])
def apply(project_id):
    if 'logged_in' in session:
        userType = session['logged_in']['userType']
    else:
        return "Not logged in."

    if userType == 'student':
        student = Student.query.filter(Student.UserID == session['logged_in']['UserID']).all()[0]
    elif userType == 'sponsor':
        sponsor = Sponsor.query.filter(Sponsor.UserID == session['logged_in']['UserID']).all()[0]

    if request.method == 'POST':
        if userType != 'student':
            return "Incorrect user type."
        print session['logged_in']
        new_application = Application(student.StudentID, int(project_id), 'applied')
        db.session.merge(new_application)
        db.session.commit()
        return "OK"
    else:
        if userType == 'student':
            print "student apply get"
            application = Application.query\
                .filter(Application.StudentID == student.StudentID)\
                .filter(Application.ProjectID == project_id).all()
            print str(application)
            return str(application)

        elif userType == 'sponsor':
            print "sponsor apply get"
            application = db.session.query(Application, Project, Sponsor).join(Project).join(Sponsor)\
                .filter(Sponsor.SponsorID == sponsor.SponsorID)\
                .filter(Project.ProjectID == project_id).all()
            print application
            counter = 0
            joined_items = []
            for (application, project, sponsor) in application:
                joined_item = {}
                joined_item['ProjectID'] = int(project.ProjectID)
                joined_item['StudentID'] = application.StudentID
                joined_item['SponsorID'] = sponsor.SponsorID
                joined_items.append(joined_item)
                counter += 1
                print "JOINED ITEM: " + json.dumps(joined_item)

            print str(joined_items)
            return json.dumps(joined_items), 200, {'Content-Type': 'application/json; charset=utf-8'}

@app.route('/api/project/<project_id>/cancel', methods=['POST', 'GET'])
def cancel(project_id):
    student = Student.query.filter(Student.UserID == session['logged_in']['UserID']).all()[0]
    if request.method == 'POST':
        new_application = Application.query\
            .filter(Application.StudentID == student.StudentID)\
            .filter(Application.ProjectID == int(project_id)).first()
        new_application.application_status = 'cancelled'
        db.session.commit()
    return "OK"


@app.route('/api/project/<project_id>/application/<student_id>', methods=['GET', 'POST'])
def get_application_status(project_id, student_id):
    if request.method == 'GET':
        print "GET: project_id="+str(project_id)+", student_id="+str(student_id)
        application = Application.query\
            .filter(Application.StudentID == int(student_id))\
            .filter(Application.ProjectID == int(project_id)).first()
        if application == None:
            return "No result"
        else:
            print str(application)
            return application.application_status
    else:
        json_data = request.get_json()
        application = Application.query\
            .filter(Application.StudentID == int(student_id))\
            .filter(Application.ProjectID == int(project_id)).first()
        application.application_status = 'accepted'

        other_applications = Application.query\
            .filter(Application.ProjectID == int(project_id))\
            .filter(Application.StudentID != int(student_id)).all()

        for other_application in other_applications:
            other_application.application_status = 'unsuccessful'

        project = Project.query.filter(Project.ProjectID == int(project_id)).first()
        project.status = 'ongoing'
        project.StudentID = student_id
        db.session.commit()

        return "OK"

# @app.route('/api/sponsor/<user_id>/project', methods=['GET'])
# def get_sponsor_projects(user_id):
#     projects = []
#     sponsor = Sponsor.query.filter(Sponsor.UserID == user_id).all()[0]
#     projects = Project.query.filter(Project.SponsorID == sponsor.SponsorID).all()
#     print str(projects)
#     return str(projects)

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
