'use strict';
module.exports = (sequelize, DataTypes) => {
	const guildBlacklist = sequelize.define('guildBlacklist', {
		guildID: DataTypes.BIGINT
	}, {});
	guildBlacklist.associate = function(models) {
		// associations can be defined here
	};
	return guildBlacklist;
};