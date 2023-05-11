const jwt = require('jsonwebtoken');
const {ROLES} = require('../models/user');
const User = require('../models').User;

async function auth(req,res,next){
    //Get token from cookie
    const token = req.cookies.session;        
    //Check if token is present
    if(token == undefined) return res.redirect('/');
    
    //Verify token and send response according to it
    const verified = jwt.verify(token,process.env.SECRET);
    if(verified){
        const userRole = await User.findOne({where:{
            id:verified.id,
            role:ROLES.ADMIN_ROLE
        }});
        
        if(userRole){
            req.user_id = verified.id
            next();
        }
        else{
            res.clearCookie('session');
            res.redirect('/')
        }
    }else{
        res.redirect('/');
    }
}

module.exports = auth;