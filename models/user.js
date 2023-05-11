'use strict';
const {
  Model
} = require('sequelize');

const USER_ROLE = 0;
const ADMIN_ROLE = 1;


module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    
    static associate(models) {
      // define association here
    }
  }
  User.init({
    role: {
      type: DataTypes.TINYINT,
      comment:'ADMIN = 1,USER = 0'
    },
    image: {
      type: DataTypes.STRING,
      get(){
        const value = this.getDataValue('image');
        if(value != null){
          return '/storage/images/users/'+value;
        }else{
          return '/storage/images/blank.jpeg';
        }
      }
    },
    name: {
      type: DataTypes.STRING(100)
    },
    email: {
      type: DataTypes.STRING(100)
    },
    password: {
      type: DataTypes.STRING
    },
  }, {
    scopes: {
      removePassword: {
        attributes:{
          exclude:['password']
        }
      },
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};
module.exports.ROLES = {USER_ROLE,ADMIN_ROLE};