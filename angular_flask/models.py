from datetime import datetime

from angular_flask.core import db
from angular_flask import app


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

    def __init__(self, CourseID, title, description):
        self.CourseID = CourseID
        self.title = title
        self.description = description


    def __repr__(self):
        return '<course %r>' % self.title

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

    def __init__(self, UserID, login, password, FirstName, LastName, userType):
        self.UserID = UserID
        self.login = login
        self.password = password
        self.FirstName = FirstName
        self.LastName = LastName
        self.userType = userType

    def __repr__(self):
        return '<user %r>' % self.login
# models for which we want to create API endpoints
app.config['API_MODELS'] = {'course': Course, 'page': Page, 'user': User}

# models for which we want to create CRUD-style URL endpoints,
# and pass the routing onto our AngularJS application
app.config['CRUD_URL_MODELS'] = {'course': Course, 'page': Page, 'user': User}
