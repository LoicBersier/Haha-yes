/* eslint-disable no-unused-vars */

"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("autoresponseStats", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      serverID: {
        type: Sequelize.BIGINT,
      },
      stat: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("autoresponseStats");
  },
};
