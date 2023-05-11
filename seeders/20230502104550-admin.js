'use strict';
const {ROLES} = require('../models/user');
const bcrypt = require('bcryptjs');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash('admin',salt);
    return queryInterface.bulkInsert('Users',[
      {
        role:ROLES.ADMIN_ROLE,
        name:'Admin',
        email:'admin@admin.com',
        password:hashPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },
  
  async down (queryInterface, Sequelize) {
    /**
    * Add commands to revert seed here.
    *
    * Example:
    * await queryInterface.bulkDelete('People', null, {});
    */
  }
};
