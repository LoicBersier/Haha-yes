'use strict';
module.exports = (sequelize, DataTypes) => {
	const donator = sequelize.define('donator', {
		userID: DataTypes.BIGINT,
		comment: DataTypes.STRING
	}, {});
	donator.associate = function(models) {
		// associations can be defined here
	};
	return donator;
};