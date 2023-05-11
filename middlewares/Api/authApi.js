const jwt = require('jsonwebtoken');
const {ROLES} = require('../../models/user');
const User = require('../../models').User;

async function authUser(req,res,next){
    try {
        //Get token from headers
        if(req.headers.authorization != undefined){
            //Getting token after spliting form Bearer
            const token = req.headers.authorization.split(" ")[1];
            //Verify token and send response according to it
            const decodedToken = jwt.verify(token,process.env.SECRET);
            const userRole = await User.findOne({where:{
                id:decodedToken.id,
                role:ROLES.USER_ROLE
            }});
            
            if(userRole){
                req.user_id = decodedToken.id;
                next();
            }else{
                return res.status(403).json({error:"Un-authorised!"});
            }
        }else{
            return res.status(403).json({error:"Un-authorised!"});
        }
    } catch (error) {
        return res.status(400).json({error:error.message});
    }
}

module.exports = authUser