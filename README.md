# Express Admin Panel sample project

## Description
-To roles demo project panel for admin and apis for user

-Simple admin panel with login and logout for admin with dashboard,users option using node,express,ejs,
ejs-express-layouts,sequelize-ORM,mysql.

## Installation

```bash
$ npm install
$ npx sequelize-cli db:migrate //To migrate user table
$ npx sequelize-cli db:seed:all //To Seed admin details
```

# Sequlize-ORM
-First go to config folder and open config.json file.
-Add your database credentials in this code below:
"development": {
    "username": "root", //Your username
    "password": null, //Your Password if any
    "database": "admin_user_demo", //Your Database name
    "host": "127.0.0.1", //Your host name
    "dialect": "mysql", 
    "logging":false //Remove this option if you want to log queries running in background
  },

## Running the app

```bash
# Start the server
$ npm run dev

```
Project will start on port 4002 on localhost (http://localhost:4002).

## Test
No tests included this time. Just playing around with the framework.

## Functionality
The project contain for functionality as given below.

# ADMIN
-Login for admin.
-Seeder used for admin credentials
-Show dashboard and user table to admin.
-View user details, single user delete, multi user delete

# User
-Registration and login for user.
-Update user profile.
-Upload user image.


## Login for admin
For login you need to pass email and password in body of API (http://localhost:4000/).

## Registration for user
For registration you need to pass name,email and password in body of API (http://localhost:4000/api/register).

## Login for user
For login you need to pass email and password in body of API (http://localhost:4000/api/login).

## Show user profile details
To view user details you need to pass bearer token in headers on (http://localhost:4000/api/profile) with GET request.

## Update user profile details
To update user details you need to pass bearer token in headers on (http://localhost:4000/api/profile) with POST request along with name and IMAGE IN BASE64 format in body form-data 


