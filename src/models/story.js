'use strict';
module.exports = (sequelize, DataTypes) => {
  const Story = sequelize.define('Story', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: [5, 254]
      }
  }, {});
  Story.associate = models => {
    // associations can be defined here
  };
  return Story;
};