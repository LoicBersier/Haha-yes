/* eslint-disable no-unused-vars */
/* eslint-disable indent */
'use strict';
module.exports = (sequelize, DataTypes) => {
  const autoresponse = sequelize.define('autoresponse', {
    trigger: DataTypes.STRING,
    response: DataTypes.STRING,
    type: DataTypes.STRING
  }, {});
  autoresponse.associate = function(models) {
    // associations can be defined here
  };
  return autoresponse;
};