'use strict';
module.exports = (sequelize, DataTypes) => {
	const LogStats = sequelize.define('LogStats', {
		guild: DataTypes.BIGINT,
		channel: DataTypes.BIGINT
	}, {});
	LogStats.associate = function(models) {
		// associations can be defined here
	};
	return LogStats;
};