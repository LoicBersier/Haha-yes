'use strict';
module.exports = (sequelize, DataTypes) => {
  const commandBlock = sequelize.define('commandBlock', {
    serverID: DataTypes.BIGINT,
    command: DataTypes.STRING
  }, {});
  commandBlock.associate = function(models) {
    // associations can be defined here
  };
  return commandBlock;
};