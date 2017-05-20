CREATE DATABASE  IF NOT EXISTS `project` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `project`;
-- MySQL dump 10.13  Distrib 5.7.17, for Linux (x86_64)
--
-- Host: localhost    Database: project
-- ------------------------------------------------------
-- Server version   5.7.18-0ubuntu0.16.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin` (
      `AdminID` int(11) NOT NULL AUTO_INCREMENT,
      `UserID` int(11) NOT NULL,
      PRIMARY KEY (`AdminID`),
      KEY `UserID` (`UserID`),
      CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,1);
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `application`
--

DROP TABLE IF EXISTS `application`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `application` (
      `ProjectID` int(11) NOT NULL,
      `StudentID` int(11) NOT NULL,
      `application_status` varchar(45) DEFAULT NULL,
      PRIMARY KEY (`ProjectID`,`StudentID`),
      KEY `fk_application_2_idx` (`StudentID`),
      CONSTRAINT `fk_application_1` FOREIGN KEY (`ProjectID`) REFERENCES `project` (`ProjectID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
      CONSTRAINT `fk_application_2` FOREIGN KEY (`StudentID`) REFERENCES `student` (`StudentID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application`
--

LOCK TABLES `application` WRITE;
/*!40000 ALTER TABLE `application` DISABLE KEYS */;
INSERT INTO `application` VALUES (1,1,'unsuccessful'),(1,3,'accepted'),(2,3,'accepted'),(3,1,'accepted'),(3,3,'unsuccessful'),(4,3,'accepted'),(4,6,'applied'),(5,6,'accepted'),(6,1,'accepted'),(6,6,'unsuccessful'),(7,6,'completed'),(8,1,'completed'),(10,6,'accepted');
/*!40000 ALTER TABLE `application` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `course` (
      `CourseID` int(11) NOT NULL AUTO_INCREMENT,
      `title` varchar(80) DEFAULT NULL,
      `description` varchar(80) DEFAULT NULL,
      `category` varchar(80) DEFAULT NULL,
      `header_image` varchar(255) DEFAULT NULL,
      `content` varchar(25000) DEFAULT NULL,
      PRIMARY KEY (`CourseID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course`
--

LOCK TABLES `course` WRITE;
/*!40000 ALTER TABLE `course` DISABLE KEYS */;
INSERT INTO `course` VALUES (1,'intro to git gud','how 2 git gud?','programming','https://i.ytimg.com/vi/s5IROI4pGa0/hqdefault.jpg',NULL),(2,'intro to magic','being meguca is suffering','magic','http://z1035.com/wp-content/uploads/2015/09/Harry-Potter-Voldemort.jpg',NULL),(3,'apitest','helo','programming','http://images2.fanpop.com/image/photos/14000000/Gollum-Smeagol-smeagol-gollum-14076880-960-403.jpg',NULL),(4,'fourth','hey','magic','http://cdn.collider.com/wp-content/uploads/2016/11/harry-potter-dumbledore-slice-600x200.jpg',NULL),(5,'Google Python','Google\'s Python intro','programming','https://www.python.org/static/community_logos/python-logo-master-v3-TM.png','<h1>Python Set Up</h1>\n\n<p>\n  This page explains how to set up Python on a machine so you can run and edit Python programs, and links to the exercise code to download. You can do this before starting the class, or you can leave it until you\'ve gotten far enough in the class that you want to write some code. The Google Python Class uses a simple, standard Python installation, although more complex strategies are possible. Python is free and open source, available for all operating systems from python.org. In particular we want a Python install where you can do two things:\n<p>\n<ul>\n  <li>Run an existing python program, such as hello.py</li>\n  <li>Run the Python interpreter interactively, so you can type code right at it</li>\n</ul>\n<p>\n  Both of the above are done quite a lot in the lecture videos, and it\'s definitely something you need to be able to do to solve the exercises.\n</p>\n\n<h1>Download Google Python Exercises</h1>\n\n<p>\n  As a first step, download the google-python-exercises.zip file and unzip it someplace where you can work on it. The resulting google-python-exercises directory contains many different python code exercises you can work on. In particular, google-python-exercises contains a simple hello.py file you can use in the next step to check that Python is working on your machine. Below are Python instructions for Windows and all other operation systems:\n  Python on Linux, Mac OS X, etc.\n<br />\nMost operating systems other than Windows already have Python installed by default. To check that Python is installed, open a command line (typically by running the \"Terminal\" program), and cd to the google-python-exercises directory. Try the following to run the hello.py program (what you type is shown in bold):\n\n<code>\n~/google-python-exercises$ python hello.py\nHello World\n~/google-python-exercises$ python hello.py Alice\nHello Alice\nIf python is not installed, see the Python.org download page. To run the Python interpreter interactively, just type \"python\" in the terminal:\n\n~/google-python-exercises$ python\nPython 2.5.2 (r252:60911, Feb 22 2008, 07:57:53) \n[GCC 4.0.1 (Apple Computer, Inc. build 5363)] on darwin\n/*!40000 ALTER TABLE `course` ENABLE KEYS */;
    UNLOCK TABLES;

    --
    -- Table structure for table `enrolment`
    --

    DROP TABLE IF EXISTS `enrolment`;
    /*!40101 SET @saved_cs_client     = @@character_set_client */;
    /*!40101 SET character_set_client = utf8 */;
    CREATE TABLE `enrolment` (
          `CourseID` int(11) NOT NULL,
          `StudentID` int(11) NOT NULL,
          `status` varchar(80) DEFAULT NULL,
          PRIMARY KEY (`CourseID`,`StudentID`),
          KEY `StudentID` (`StudentID`),
          CONSTRAINT `enrolment_ibfk_1` FOREIGN KEY (`CourseID`) REFERENCES `course` (`CourseID`),
          CONSTRAINT `enrolment_ibfk_2` FOREIGN KEY (`StudentID`) REFERENCES `student` (`StudentID`)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
    /*!40101 SET character_set_client = @saved_cs_client */;

    --
    -- Dumping data for table `enrolment`
    --

    LOCK TABLES `enrolment` WRITE;
    /*!40000 ALTER TABLE `enrolment` DISABLE KEYS */;
    INSERT INTO `enrolment` VALUES (1,3,'completed'),(1,4,'enrolled'),(1,6,'completed'),(5,1,'completed'),(5,3,'completed'),(5,5,'completed'),(5,6,'completed');
    /*!40000 ALTER TABLE `enrolment` ENABLE KEYS */;
    UNLOCK TABLES;

    --
    -- Table structure for table `page`
    --

    DROP TABLE IF EXISTS `page`;
    /*!40101 SET @saved_cs_client     = @@character_set_client */;
    /*!40101 SET character_set_client = utf8 */;
    CREATE TABLE `page` (
          `PageID` int(11) NOT NULL AUTO_INCREMENT,
          `CourseID` int(11) DEFAULT NULL,
          `pageInCourse` int(11) DEFAULT NULL,
          `title` varchar(80) DEFAULT NULL,
          `content` varchar(5000) DEFAULT NULL,
          PRIMARY KEY (`PageID`)
    ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
    /*!40101 SET character_set_client = @saved_cs_client */;

    --
    -- Dumping data for table `page`
    --

    LOCK TABLES `page` WRITE;
    /*!40000 ALTER TABLE `page` DISABLE KEYS */;
    INSERT INTO `page` VALUES (1,1,1,'git gud first page','hey guys this is the first page for intro to git gud'),(2,2,1,'magic first','hey guys this is the first page for intro to magic');
    /*!40000 ALTER TABLE `page` ENABLE KEYS */;
    UNLOCK TABLES;

    --
    -- Table structure for table `project`
    --

    DROP TABLE IF EXISTS `project`;
    /*!40101 SET @saved_cs_client     = @@character_set_client */;
    /*!40101 SET character_set_client = utf8 */;
    CREATE TABLE `project` (
          `ProjectID` int(11) NOT NULL AUTO_INCREMENT,
          `SponsorID` int(11) NOT NULL,
          `StudentID` int(11) DEFAULT NULL,
          `title` varchar(80) DEFAULT NULL,
          `description` varchar(2000) DEFAULT NULL,
          `category` varchar(80) DEFAULT NULL,
          `status` varchar(80) DEFAULT NULL,
          `deliverables` varchar(2000) DEFAULT NULL,
          `requirements` varchar(2000) DEFAULT NULL,
          `payment` float DEFAULT NULL,
          `thumbnail` varchar(255) DEFAULT NULL,
          PRIMARY KEY (`ProjectID`),
          KEY `fk_project_1_idx` (`SponsorID`),
          KEY `fk_project_2_idx` (`StudentID`),
          CONSTRAINT `fk_project_1` FOREIGN KEY (`SponsorID`) REFERENCES `sponsor` (`SponsorID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fk_project_2` FOREIGN KEY (`StudentID`) REFERENCES `student` (`StudentID`) ON DELETE NO ACTION ON UPDATE NO ACTION
    ) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
    /*!40101 SET character_set_client = @saved_cs_client */;

    --
    -- Dumping data for table `project`
    --

    LOCK TABLES `project` WRITE;
    /*!40000 ALTER TABLE `project` DISABLE KEYS */;
    INSERT INTO `project` VALUES (1,1,NULL,'1','2','3','ongoing',NULL,NULL,NULL,NULL),(2,1,NULL,'qwe','qwe','qwe','ongoing',NULL,NULL,NULL,NULL),(3,1,NULL,'Shoelace Bot','I need a bot to tie my shoelaces!','Programming','ongoing',NULL,NULL,NULL,NULL),(4,1,NULL,'Noodlebot','Makes noodles','Programming','ongoing','Script of noodlebot','Javascript',11.66,NULL),(5,1,NULL,'Capture the Frog','I have frog in garden is scary. Maybe poison.','Magic','ongoing','Frog.','Python',1200,NULL),(6,2,NULL,'Chrome','Make me a browser that doesn\'t eat all my RAM.','Programming','ongoing','Internet Explorer','C',5,NULL),(7,2,6,'Maps','Find treasure.','Programming','completed','X','C',10000,NULL),(8,1,1,'Snake','Make me a snake','Programming','completed','Snake','Google Python',50,NULL),(9,1,NULL,'Potato','Bake potato','Programming','open','Potato','Java',10,NULL),(10,1,6,'Get Good','Become skillful, acquire proficiency.','Programming','ongoing','Skill','intro to git gud',4,'http://thewoksoflife.com/wp-content/uploads/2016/04/noodle-recipe-6.jpg');
    /*!40000 ALTER TABLE `project` ENABLE KEYS */;
    UNLOCK TABLES;

    --
    -- Table structure for table `sponsor`
    --

    DROP TABLE IF EXISTS `sponsor`;
    /*!40101 SET @saved_cs_client     = @@character_set_client */;
    /*!40101 SET character_set_client = utf8 */;
    CREATE TABLE `sponsor` (
          `SponsorID` int(11) NOT NULL AUTO_INCREMENT,
          `UserID` int(11) NOT NULL,
          PRIMARY KEY (`SponsorID`),
          KEY `fk_sponsor_1_idx` (`UserID`),
          CONSTRAINT `fk_sponsor_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE NO ACTION ON UPDATE NO ACTION
    ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
    /*!40101 SET character_set_client = @saved_cs_client */;

    --
    -- Dumping data for table `sponsor`
    --

    LOCK TABLES `sponsor` WRITE;
    /*!40000 ALTER TABLE `sponsor` DISABLE KEYS */;
    INSERT INTO `sponsor` VALUES (1,28),(2,30),(3,31);
    /*!40000 ALTER TABLE `sponsor` ENABLE KEYS */;
    UNLOCK TABLES;

    --
    -- Table structure for table `student`
    --

    DROP TABLE IF EXISTS `student`;
    /*!40101 SET @saved_cs_client     = @@character_set_client */;
    /*!40101 SET character_set_client = utf8 */;
    CREATE TABLE `student` (
          `StudentID` int(11) NOT NULL AUTO_INCREMENT,
          `UserID` int(11) NOT NULL,
          `SupervisorID` int(11) NOT NULL,
          PRIMARY KEY (`StudentID`),
          KEY `UserID` (`UserID`),
          KEY `student_ibfk_2_idx` (`SupervisorID`),
          CONSTRAINT `student_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE
    ) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
    /*!40101 SET character_set_client = @saved_cs_client */;

    --
    -- Dumping data for table `student`
    --

    LOCK TABLES `student` WRITE;
    /*!40000 ALTER TABLE `student` DISABLE KEYS */;
    INSERT INTO `student` VALUES (1,2,1),(3,10,1),(4,24,1),(5,25,1),(6,29,1);
    /*!40000 ALTER TABLE `student` ENABLE KEYS */;
    UNLOCK TABLES;

    --
    -- Table structure for table `submission`
    --

    DROP TABLE IF EXISTS `submission`;
    /*!40101 SET @saved_cs_client     = @@character_set_client */;
    /*!40101 SET character_set_client = utf8 */;
    CREATE TABLE `submission` (
          `SubmissionID` int(11) NOT NULL AUTO_INCREMENT,
          `date` datetime DEFAULT NULL,
          `feedback` varchar(2000) DEFAULT NULL,
          `item` varchar(255) DEFAULT NULL,
          `ProjectID` int(11) DEFAULT NULL,
          `StudentID` int(11) DEFAULT NULL,
          `description` varchar(2000) DEFAULT NULL,
          PRIMARY KEY (`SubmissionID`),
          KEY `fk_submission_1_idx` (`ProjectID`),
          KEY `fk_submission_2_idx` (`StudentID`),
          CONSTRAINT `fk_submission_1` FOREIGN KEY (`ProjectID`) REFERENCES `project` (`ProjectID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
          CONSTRAINT `fk_submission_2` FOREIGN KEY (`StudentID`) REFERENCES `student` (`StudentID`) ON DELETE NO ACTION ON UPDATE NO ACTION
    ) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
    /*!40101 SET character_set_client = @saved_cs_client */;

    --
    -- Dumping data for table `submission`
    --

    LOCK TABLES `submission` WRITE;
    /*!4
