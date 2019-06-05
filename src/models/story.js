'use strict';

const Sequelize = require('./index').Sequelize;
const sequelize = require('./index').sequelize;

export class Story extends Sequelize.models { }
Story.init({
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [5, 254]
    }
  }
}, {
  sequelize,
    modelName: 'stort'
  });