'use strict';
module.exports = (sequelize, DataTypes) => {
  const guessLeaderboard = sequelize.define('guessLeaderboard', {
    memberID: DataTypes.INTEGER,
    try: DataTypes.INTEGER,
    difficulty: DataTypes.STRING
  }, {});
  guessLeaderboard.associate = function(models) {
    // associations can be defined here
  };
  return guessLeaderboard;
};