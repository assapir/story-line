'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
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
    indexes: [
      {
        unique: true,
        fields: ['email']
      }]
    });
  User.associate = models => {
    User.hasMany(models.Line);
  };
  return User;
};