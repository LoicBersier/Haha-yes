'use strict';
module.exports = (sequelize, DataTypes) => {
  const ytpblacklist = sequelize.define('ytpblacklist', {
    userID: DataTypes.BIGINT,
    reason: DataTypes.STRING
  }, {});
  ytpblacklist.associate = function(models) {
    // associations can be defined here
  };
  return ytpblacklist;
};