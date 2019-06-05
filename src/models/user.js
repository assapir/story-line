'use strict';

const Sequelize = require('./index').Sequelize;
const sequelize = require('./index').sequelize;

export class User extends Sequelize.Model { }
User.init({
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  }
}, {
  sequelize,
  modelName: 'user'
})