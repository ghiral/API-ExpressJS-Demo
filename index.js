//Import required libraries and models
const express = require('express');
var expressBusboy = require('express-busboy');
const app = express();
const db = require('./models');
var  fs = require ( 'fs' );
const cookieParser = require('cookie-parser');
const path = require('path');
const expressLayout = require('express-ejs-layouts');

//To access env variables
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 4002;

//WEB AUTH MIDDLEWARES
const auth = require('./middlewares/auth');
const guest = require('./middlewares/guest');


//API AUTH MIDDLEWARES
const authUser = require('./middlewares/Api/authApi');

//USE MIDDLEWARE
expressBusboy.extend(app,{
    upload:true
});

//SYNCING DB
db.sequelize.sync().then(()=>{
    console.log("All Model Syncing!");
}).catch((err)=>{
    console.log(err);
});

//WEB ROUTES
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const profileRoutes = require('./routes/profile');
const usersRoutes = require('./routes/users');

//API ROUTES
const apiAuthRoutes = require('./routes/Api/auth');
const apiUserRoutes = require('./routes/Api/users');


//Use express middlewares
app.use(cookieParser());
app.set('view engine','ejs');
app.use(expressLayout);
app.set('layout',__dirname+"/views/layout");
app.set('views',__dirname+"/views/admin");

app.use(express.static(path.join(__dirname,"public")));
app.use('/storage/images/', express.static(process.cwd() + '/storage/images/'))

//CALLING WEB ROUTES
app.use('/',authRoutes);
app.use('/admin',auth,dashboardRoutes);
app.use('/admin',auth,profileRoutes);
app.use('/admin',auth,usersRoutes);

//CALLING API ROUTES
app.use('/api',apiAuthRoutes);
app.use('/api',authUser,apiUserRoutes);

//Diffrent layout for login page
app.set("layout login", false);

app.get('/',guest,(req,res)=>{
    res.render('login',{layout:'login'});
});

//Server starts
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}` );
});