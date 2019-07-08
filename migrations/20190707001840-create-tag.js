/* eslint-disable no-unused-vars */
/* eslint-disable indent */
'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Tags', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      trigger: {
        type: Sequelize.TEXT,
        unique: true
      },
      response: {
        type: Sequelize.TEXT,
      },
      ownerID: {
        type: Sequelize.BIGINT,
      },
      serverID: {
        type: Sequelize.BIGINT,
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
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Tags');
  }
};