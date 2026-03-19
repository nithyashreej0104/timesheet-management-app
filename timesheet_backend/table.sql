-- create datebase 
CREATE DATABASE timesheet;

-- use this database 
USE timesheet;

-- SHOW DATABASE 
SHOW DATABASES;

-- CREATE TABLE AND COLUMS ;

CREATE table employee(
    Employee_Id varchar(10),
    Employee_Role varchar(10),
    Employee_Name varchar(50),
    Contact_No varchar(13),
    Email varchar(50),
    Password varchar(255),
    Employee_Status varchar(50),
    otp int,
    otp_expiry DATETIME,
    profile_image varchar(255)
    
);

-- view the table 
DESCRIBE employee;
SELECT * FROM employee;



-- create the table for timesheet ------------
CREATE TABLE timesheet (
    Timesheet_Id varchar(45) PRIMARY KEY, 
    Employee_Id varchar(45),
    Project_Id varchar(45) ,
    Timesheet_Start_Date date , 
    Timesheet_End_Date date ,
    Day1_Hrs varchar(45) ,
    Day2_Hrs varchar(45) ,
    Day3_Hrs varchar(45) ,
    Day4_Hrs varchar(45) ,
    Day5_Hrs varchar(45) ,
    Day6_Hrs varchar(45),
    Day7_Hrs varchar(45),
    Total_Hrs decimal(7,2), 
    Timesheet_Status varchar(45) ,
    Supervision varchar(45) ,
    Timesheet_Submit_Date date ,
    Supervision_Date date ,
    Revision int
);

-- view the table 
DESCRIBE timesheet;
SELECT * FROM timesheet;

-- create table for leave--------------------

CREATE TABLE `Leave` (
    Leave_Id varchar(45) PRIMARY KEY, 
    Employee_Id varchar(45),
    Project_Id varchar(45) ,
    Leave_Start_Date date , 
    Leave_End_Date date ,
    Day1_Hrs varchar(45) ,
    Day2_Hrs varchar(45) ,
    Day3_Hrs varchar(45) ,
    Day4_Hrs varchar(45) ,
    Day5_Hrs varchar(45) ,
    Day6_Hrs varchar(45),
    Day7_Hrs varchar(45),
    Total_Hrs decimal(7,2), 
    Leave_Status varchar(45) ,
    Supervision varchar(45) ,
    Leave_Submit_Date date ,
    Supervision_Date date ,
    Revision int
);

-- view the table 
DESCRIBE leave;
SELECT * FROM leave;
SELECT * FROM `leave`;

-- create the table for project -------------------------------

CREATE TABLE project (
    Project_Id varchar(10) PRIMARY KEY, 
    Vendor_ID varchar(45) ,
    Project_Name varchar(45), 
    Project_Code varchar(45) ,
    Project_Status varchar(20)
);

-- create the table for project-allaction --------

CREATE TABLE project_allaction (
    Project_Id varchar(10) PRIMARY KEY, 
    Employee_Id varchar(45) ,
    Project_Start_Date date ,
    Project_End_Date date ,
    Project_Current_Status varchar(45), 
    Project_Supervisor_Id varchar(45)
);


-- view the table 
DESCRIBE project;
SELECT * FROM project;


-- view the table 
DESCRIBE project_allaction;
SELECT * FROM project_allaction;


-- calendar table 

CREATE TABLE calendar (
    CalendarID INT AUTO_INCREMENT PRIMARY KEY,
    Event_Name VARCHAR(100),
    Event_Date DATE,
    Event_Type VARCHAR(45),
    Event_EveryYear VARCHAR(45)
);

INSERT INTO calendar (Event_Name, Event_Date, Event_Type, Event_EveryYear)
VALUES
    ('New Year', '2026-01-01', 'holiday', 'Yes'),
    ('Pongal', '2026-01-15', 'holiday', 'Yes'),
    ('Republic Day', '2026-01-26', 'holiday', 'Yes'),
    ('Tamil New Year', '2026-04-14', 'holiday', 'Yes'),
    ('Ramzan', '2026-03-21', 'holiday', 'Yes'),
    ('Bakrid', '2026-05-28', 'holiday', 'Yes'),
    ('Muharram', '2026-06-26', 'holiday', 'Yes'),
    ('Independence Day', '2026-08-15', 'holiday', 'Yes');


-- 