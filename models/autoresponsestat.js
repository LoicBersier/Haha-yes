/* eslint-disable no-unused-vars */

"use strict";
module.exports = (sequelize, DataTypes) => {
  const autoresponseStat = sequelize.define(
    "autoresponseStat",
    {
      serverID: DataTypes.STRING,
      stat: DataTypes.STRING,
    },
    {},
  );
  autoresponseStat.associate = function (models) {
    // associations can be defined here
  };
  return autoresponseStat;
};
