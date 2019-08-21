'use strict';
module.exports = (sequelize, DataTypes) => {
  const bannedWords = sequelize.define('bannedWords', {
    word: DataTypes.STRING,
    serverID: DataTypes.BIGINT
  }, {});
  bannedWords.associate = function(models) {
    // associations can be defined here
  };
  return bannedWords;
};