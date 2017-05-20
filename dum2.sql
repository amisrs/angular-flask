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
      CONSTRAINT `student_ibfk_1` FOREIGN KEY (`UserID`) REFERENC/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
    /*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
    /*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
    /*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
    /*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

    -- Dump completed on 2017-05-20 17:14:11
