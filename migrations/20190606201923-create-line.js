'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Lines', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      text: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addColumn('Lines', 'storyId', {
      type: Sequelize.INTEGER,
      refernce: {
        model: 'Stories',
        key: 'id'
      }
    });
    
    return queryInterface.addColumn('Lines', 'userId', {
      type: Sequelize.INTEGER,
      refernce: {
        model: 'Users',
        key: 'id'
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Lines');
  }
};