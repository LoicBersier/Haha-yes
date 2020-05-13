'use strict';
module.exports = (sequelize, DataTypes) => {
  const ytpHash = sequelize.define('ytpHash', {
    hash: DataTypes.STRING,
    link: DataTypes.STRING,
    messageID: DataTypes.BIGINT
  }, {});
  ytpHash.associate = function(models) {
    // associations can be defined here
  };
  return ytpHash;
};