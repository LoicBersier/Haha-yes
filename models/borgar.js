'use strict';
module.exports = (sequelize, DataTypes) => {
	const borgar = sequelize.define('borgar', {
		userID: DataTypes.BIGINT,
		level: DataTypes.INTEGER,
		xp: DataTypes.INTEGER
	}, {});
	borgar.associate = function(models) {
		// associations can be defined here
	};
	return borgar;
};