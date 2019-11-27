'use strict';
module.exports = (sequelize, DataTypes) => {
  const leaveChannel = sequelize.define('leaveChannel', {
    channelID: DataTypes.BIGINT,
    guildID: DataTypes.BIGINT,
    message: DataTypes.STRING
  }, {});
  leaveChannel.associate = function(models) {
    // associations can be defined here
  };
  return leaveChannel;
};