create table user(
  UserID INT,
  login VARCHAR(20),
  password VARCHAR(80),
	FirstName VARCHAR(20),
	LastName VARCHAR(20),
  userType VARCHAR(20),
  PRIMARY KEY(UserID)
);

create table student(
	StudentID INT,
	UserID INT NOT NULL,
  PRIMARY KEY(StudentID),
  FOREIGN KEY(UserID) REFERENCES user(UserID) ON DELETE CASCADE
);

create table admin(
	AdminID INT,
	UserID INT NOT NULL,
  PRIMARY KEY(AdminID),
	FOREIGN KEY(UserID) REFERENCES user(UserID) ON DELETE CASCADE
);

create table course(
	CourseID INT,
	title VARCHAR(80),
  description VARCHAR(80),
  PRIMARY KEY(CourseID)
);

create table page(
  CourseID INT,
  PageID INT,
  pageInCourse INT,
  title VARCHAR(80),
  content VARCHAR(5000),
  PRIMARY KEY(PageID)
);

create table certification(
  CourseID INT NOT NULL,
  StudentID INT NOT NULL,
  FOREIGN KEY(CourseID) REFERENCES course(CourseID),
  FOREIGN KEY(StudentID) REFERENCES student(StudentID)
);

insert into course values(1, 'intro to git gud', 'how 2 git gud?');
insert into page values(1, 1, 1, 'git gud first page', 'hey guys this is the first page for intro to git gud');

insert into course values(2, 'intro to meguca', 'being meguca is suffering?');
insert into page values(2, 2, 1, 'meguca first', 'hey guys this is the first page for intro to meguca');

insert into user values(1, 'amisrs', 'plaintext', 'Ami', 'Srs', 'admin');
insert into admin values(1, 1);

insert into user values(2, 'cooby', 'plaintext', 'cooby', 'rabu', 'student');
insert into student values(1, 2);
