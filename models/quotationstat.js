'use strict';
module.exports = (sequelize, DataTypes) => {
  const quotationStat = sequelize.define('quotationStat', {
    serverID: DataTypes.BIGINT,
    stat: DataTypes.STRING
  }, {});
  quotationStat.associate = function(models) {
    // associations can be defined here
  };
  return quotationStat;
};