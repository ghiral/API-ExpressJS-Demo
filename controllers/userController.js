const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const User = require('../models').User;
const {ROLES, STATUS}  = require('../models/user');
const fs = require('fs');
const path = require('path');

//Show user data in data tables frontend with searching and sorting
const index = async(req,res)=>{
    
    //Check if it is ajax request
    if(req.xhr){
        
        //Required parameters for data tables
        var draw = parseInt(req.query.draw);
        var start = parseInt(req.query.start);
        var length = parseInt(req.query.length);
        var name = 'id';
        var dir = 'desc';
        
        //Check which column is set for sorting
        if(req.query.order != undefined){
            var order = req.query.order;
            column = order[0].column;
            var name = req.query.columns[column].name;
            dir = req.query.order[0].dir;
        }
        
        //Search value from frontend
        var search_value = req.query.search['value'];
        
        //Count data based on search value if provided then all data count will be given
        var usersCount = await User.count({
            // offset:start,
            // limit:length,
            where:{
                role:{
                    [Op.not]:ROLES.ADMIN_ROLE
                },
                [Op.or]:[
                    {
                        name: {
                            [Op.like]: `%${search_value}%`
                        }
                    },
                    {
                        email: {
                            [Op.like]: `%${search_value}%`
                        }
                    },
                ]   
            },
            attributes:['id','name','email'],
            order:[[name,dir]]
        });
        
        //Sned user details based on search and sort if provided with paginations
        var users = await User.findAll({
            offset:start,
            limit:length,
            where:{
                role:{
                    [Op.not]:ROLES.ADMIN_ROLE
                },
                [Op.or]:[
                    {
                        name: {
                            [Op.like]: `%${search_value}%`
                        }
                    },
                    {
                        email: {
                            [Op.like]: `%${search_value}%`
                        }
                    },
                   
                ]   
            },
            attributes:['id','name','email','role','image'],
            order:[[name,dir]]
        });

        //Parameters required for data tables for successfull run
        var output = {
            'draw' : draw,
            'recordsTotal' : usersCount,
            'recordsFiltered' : usersCount,
            'data' : users
        };
        //send response to ajax call
        return res.json(output);
    }
    res.render('users',{data:req,title:'Users'});
}

// const updateStatus = async(req,res)=>{
    
//     try {
//         const id = req.params.id;
//         const getUser = await User.findOne({where:{id}});
//         if(getUser.status == STATUS.STATUS_ACTIVE || getUser.status == STATUS.STATUS_INACTIVE){
//             var status = '';
//             var message = '';
//             if(getUser.status == STATUS.STATUS_ACTIVE){
//                 status = STATUS.STATUS_INACTIVE;
//                 message = 'User de-activated successfully!';
//             }else if(getUser.status == STATUS.STATUS_INACTIVE){
//                 status = STATUS.STATUS_ACTIVE;
//                 message = 'User activated successfully!';
//             }
            
//             const updateUser = await User.update({status},{where:{id}});
//             return res.status(200).json({status:true,message});
//         }else{
//             return res.status(400).json({status:false,error:"Something went wrong!"});
//         }    
//     } catch (error) {
//         return res.status(400).json({status:false,error:error.message});        
//     }
// }

const show = async(req,res)=>{
    //Show user data based selected row
    const id = req.params.id;
    
    var user = await User.scope('removePassword').findOne({where:{id,role:ROLES.USER_ROLE}});
    return res.status(200).json({status:true,data:user,message:'Single User'});
    
}

const destroy = async(req,res)=>{
    //Delete user
    const id = parseInt(req.params.id);
    
    const deleteUser = await User.destroy({where:{id}});
    if(deleteUser != 1){
        return res.status(400).json({status:false,error:"Something went wrong!"});
    }
    return res.status(200).json({status:true,message:"User deleted successfully!"});
}

const multipleDelete = async(req,res)=>{
    //Select multiple user adn then delete it.
    try {
        const ids = req.body.ids
        const deleteUsers = await User.destroy({where:{id:ids}});
        return res.status(200).json({status:true,message:'Data deleted successfully!'});
    } catch (error) {
        return res.status(400).json({status:false,error:error.message});
    }
}

module.exports = {index,
    // updateStatus,
    destroy,
    show,
    multipleDelete,
    index
}