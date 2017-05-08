from datetime import datetime

from angular_flask.core import db
from angular_flask import app
import json

# class Post(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     title = db.Column(db.String(80))
#     body = db.Column(db.Text)
#     pub_date = db.Column(db.DateTime)
#
#     def __init__(self, title, body, pub_date=None):
#         self.title = title
#         self.body = body
#         if pub_date is None:
#             pub_date = datetime.utcnow()
#         self.pub_date = pub_date
#
#     def __repr__(self):
#         return '<Post %r>' % self.title

class Course(db.Model):
    CourseID = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80))
    description = db.Column(db.String(80))
    category = db.Column(db.String(80))
    header_image = db.Column(db.String(255))

    def __call__(arg1, arg2, arg3):
        print "call course"

    def __init__(self, CourseID, title, description, category, header_image):
        self.CourseID = CourseID
        self.title = title
        self.description = description
        self.category = category
        self.header_image = header_image


    def __repr__(self):
        return json.dumps({
            'CourseID': self.CourseID,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'header_image': self.header_image
        })


class Page(db.Model):
    PageID = db.Column(db.Integer, primary_key=True)
    CourseID = db.Column(db.Integer)
    pageInCourse = db.Column(db.Integer)
    title = db.Column(db.String(80))
    content = db.Column(db.Text)

    def __init__(self, PageID, CourseID, pageInCourse, title, content):
        self.PageID = PageID
        self.CourseID = CourseID
        self.pageInCourse = pageInCourse
        self.title = title
        self.content = content

    def __repr__(self):
        return '<page %r>' % self.title

class User(db.Model):
    UserID = db.Column(db.Integer, primary_key=True)
    login = db.Column(db.String(20))
    password = db.Column(db.String(80))
    FirstName = db.Column(db.String(20))
    LastName = db.Column(db.String(20))
    userType = db.Column(db.String(20))

    def __call__(arg1, arg2, arg3):
        print "call user"
        #print str(arg1) + " | " + str(arg2) + " | " + str(arg3)

    def __init__(self, UserID, login, password, userType, FirstName=None, LastName=None):
        self.UserID = UserID
        self.login = login
        self.password = password
        self.userType = userType
        self.FirstName = FirstName
        self.LastName = LastName

    def __repr__(self):
        #return '<user %r>' % (self.login + '-' + str(self.UserID))
        return json.dumps({
            'UserID': self.UserID,
            'login': self.login,
            'FirstName': self.FirstName,
            'LastName': self.LastName,
            'userType': self.userType
        })

class Student(db.Model):
    StudentID = db.Column(db.Integer, primary_key=True)
    UserID = db.Column(db.Integer, db.ForeignKey('user.UserID'))
    SupervisorID = db.Column(db.Integer, db.ForeignKey('supervisor.SupervisorID'))

    def __call__(arg1, arg2, arg3):
        print "call student"
        #print str(arg1) + " | " + str(arg2) + " | " + str(arg3)

    def __init__(self, StudentID, UserID, SupervisorID):
        self.StudentID = StudentID
        self.UserID = UserID
        self.SupervisorID = SupervisorID

    def __repr__(self):
        #return '<user %r>' % (self.login + '-' + str(self.UserID))
        return json.dumps({
            'StudentID': self.StudentID,
            'UserID': self.UserID,
            'SupervisorID': self.SupervisorID
        })

class Supervisor(db.Model):
    SupervisorID = db.Column(db.Integer, primary_key=True)
    UserID = db.Column(db.Integer, db.ForeignKey('user.UserID'))

    def __call__(arg1, arg2, arg3):
        print "call supervisor"

    def __init__(self, SupervisorID, UserID):
        self.SupervisorID = SupervisorID
        self.UserID = UserID

    def __repr__(self):
        return json.dumps({
            'SupervisorID': self.SupervisorID,
            'UserID': self.UserID,
        })

class Admin(db.Model):
    AdminID = db.Column(db.Integer, primary_key=True)
    UserID = db.Column(db.Integer, db.ForeignKey('user.UserID'))

    def __call__(arg1, arg2, arg3):
        print "call admin"

    def __init__(self, AdminID, UserID):
        self.AdminID = AdminID
        self.UserID = UserID

    def __repr__(self):
        return json.dumps({
            'AdminID': self.AdminID,
            'UserID': self.UserID,
        })

class Enrolment(db.Model):
    StudentID = db.Column(db.Integer, db.ForeignKey('student.StudentID'), primary_key=True)
    CourseID = db.Column(db.Integer, db.ForeignKey('course.CourseID'), primary_key=True)
    status = db.Column(db.String(80))

    def __call__(arg1, arg2, arg3):
        print "call enrolment"
        #print str(arg1) + " | " + str(arg2) + " | " + str(arg3)

    def __init__(self, StudentID, CourseID, status):
        self.StudentID = StudentID
        self.CourseID = CourseID
        self.status = status

    def __repr__(self):
        #return '<user %r>' % (self.login + '-' + str(self.UserID))
        return json.dumps({
            'StudentID': self.StudentID,
            'CourseID': self.CourseID,
            'status': self.status
        })

# models for which we want to create API endpoints
app.config['API_MODELS'] = {
                                'course': Course,
                                'page': Page,
                                'user': User,
                                'student': Student,
                                'supervisor': Supervisor,
                                'admin': Admin,
                                'enrolment': Enrolment
                            }

# models for which we want to create CRUD-style URL endpoints,
# and pass the routing onto our AngularJS application
app.config['CRUD_URL_MODELS'] = {
                                    'course': Course,
                                    'page': Page,
                                    'user': User,
                                    'student': Student,
                                    'supervisor': Supervisor,
                                    'admin': Admin,
                                    'enrolment': Enrolment
                                }
