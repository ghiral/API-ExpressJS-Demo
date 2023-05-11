const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ROLES } = require('../../models/user');
const User = require('../../models').User;
const {userValidation} = require('../../validations/api/userValidation');


//User registration Api
const register = async(req,res)=>{
    
    try {
        const {email,password} = req.body;
        //Validating data using joi package
        const result = userValidation(req.body);
        if(result.error){
            return res.status(422).json({status:false,code:422,message:result.error.message});
        }
        //Check for duplicate email
        const checkEmail = await User.findOne({where:{email,role:ROLES.USER_ROLE}});
        if(checkEmail != undefined){
            return res.status(422).json({status:false,code:422,message:"Email already exists!"});
        }

        //Generating salt
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password,salt);
        
        req.body.password = hashPassword;
        req.body.role = ROLES.USER_ROLE;
        const user = await User.create(req.body);    
        //Scope to fetch user data without password
        const userData = await User.scope('removePassword').findOne({where:{id:user.id}});
        return res.status(201).json({status:true,code:201,message:"User register successfully!",data:userData});

    } catch (error) {
        return res.status(400).json({status:false,code:400,message:error.message})        
    }
}

const login = async(req,res)=>{
    try {
        const {email,password} = req.body;
        //check for user using email
        const getUser = await User.findOne({where:{email:email,role:ROLES.USER_ROLE},attributes:['id','email','password']});
        if(!getUser){
            return res.status(400).json({status:false,message:"Please enter correct credentials!"});
        }
        //validate user with password
        const validatePassword = await bcrypt.compare(password,getUser.password);
        if(!validatePassword) return res.status(400).json({status:false,message:"Please enter correct credentials!"});

        //Generate token
        const token  = jwt.sign({id:getUser.id,role:ROLES.USER_ROLE},process.env.SECRET,{expiresIn:'1d'});
        const refreshToken = jwt.sign({id:getUser.id,role:ROLES.USER_ROLE},process.env.REFRESH_SECRET,{expiresIn:'30d'})

        //Send user data without pasowrd
        const userData = await User.scope('removePassword').findOne({where:{id:getUser.id}});
        return res.status(200).json({status:true,data:{userData,token,refreshToken},message:"Logged In"});    
    } catch (error) {
        return res.status(400).json({status:false,message:error.message});        
    }
}

module.exports = {register,login}