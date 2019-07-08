/* eslint-disable no-unused-vars */
/* eslint-disable indent */
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    trigger: DataTypes.STRING,
    response: DataTypes.STRING,
    ownerID: DataTypes.BIGINT,
    serverID: DataTypes.BIGINT
  }, {});
  Tag.associate = function(models) {
    // associations can be defined here
  };
  return Tag;
};