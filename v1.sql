SET sql_mode = '';

create table user(
  UserID INT NOT NULL AUTO_INCREMENT,
  login VARCHAR(20),
  password VARCHAR(80),
	FirstName VARCHAR(20),
	LastName VARCHAR(20),
  userType VARCHAR(20),
  PRIMARY KEY(UserID)
);

create table student(
	StudentID INT NOT NULL AUTO_INCREMENT,
	UserID INT NOT NULL,
  SupervisorID INT NOT NULL,
  PRIMARY KEY(StudentID),
  FOREIGN KEY(UserID) REFERENCES user(UserID) ON DELETE CASCADE
  FOREIGN KEY(SupervisorID) REFERENCES supervisor(SupervisorID) ON DELETE CASCADE

);

create table admin(
	AdminID INT NOT NULL AUTO_INCREMENT,
	UserID INT NOT NULL,
  PRIMARY KEY(AdminID),
	FOREIGN KEY(UserID) REFERENCES user(UserID) ON DELETE CASCADE
);

create table supervisor(
  SupervisorID INT NOT NULL AUTO_INCREMENT,
  UserID INT NOT NULL,
  PRIMARY KEY(SupervisorID),
  FOREIGN KEY(UserID) REFERENCES user(UserID) ON DELETE CASCADE
);

create table course(
	CourseID INT NOT NULL AUTO_INCREMENT,
	title VARCHAR(80),
  description VARCHAR(80),
  header_image VARCHAR(1000),
  PRIMARY KEY(CourseID)
);

create table page(
  PageID INT NOT NULL AUTO_INCREMENT,
  CourseID INT,
  pageInCourse INT,
  title VARCHAR(80),
  content VARCHAR(5000),
  PRIMARY KEY(PageID)
);

create table enrolment(
  CourseID INT NOT NULL,
  StudentID INT NOT NULL,
  status VARCHAR(80),
  FOREIGN KEY(CourseID) REFERENCES course(CourseID),
  FOREIGN KEY(StudentID) REFERENCES student(StudentID)
);

insert into course values(null, 'intro to git gud', 'how 2 git gud?');
insert into page values(null, 1, 1, 'git gud first page', 'hey guys this is the first page for intro to git gud');

insert into course values(null, 'intro to magic', 'being meguca is suffering');
insert into page values(null, 2, 1, 'magic first', 'hey guys this is the first page for intro to magic');

insert into user values(null, 'amisrs', 'plaintext', 'Ami', 'Srs', 'admin');
insert into admin values(null, 1);

insert into user values(null, 'cooby', 'plaintext', 'cooby', 'rabu', 'student');
insert into student values(null, 2);
