'use strict';
module.exports = (sequelize, DataTypes) => {
  const TwitterBlacklist = sequelize.define('TwitterBlacklist', {
    userID: DataTypes.BIGINT,
    reason: DataTypes.STRING
  }, {});
  TwitterBlacklist.associate = function(models) {
    // associations can be defined here
  };
  return TwitterBlacklist;
};