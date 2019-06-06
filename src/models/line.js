'use strict';
module.exports = (sequelize, DataTypes) => {
  const Line = sequelize.define('Line', {
    text: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: [5, 254]
      }
    }
  }, {});
  Line.associate = models => {
    Line.belongsTo(models.User);
  };
  return Line;
};