'use strict';
module.exports = (sequelize, DataTypes) => {
	const joinChannel = sequelize.define('joinChannel', {
		channelID: DataTypes.BIGINT,
		guildID: DataTypes.BIGINT,
		message: DataTypes.STRING
	}, {});
	joinChannel.associate = function(models) {
		// associations can be defined here
	};
	return joinChannel;
};