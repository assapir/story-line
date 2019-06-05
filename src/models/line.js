'use strict';

const Sequelize = require('./index').Sequelize;
const sequelize = require('./index').sequelize;

export class Line extends Sequelize.models { }
Line.init({
  text: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [5, 254]
    }
  }
}, {
  sequelize,
  modelName: 'line'
});