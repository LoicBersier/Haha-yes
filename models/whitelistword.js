'use strict';
module.exports = (sequelize, DataTypes) => {
	const whitelistWord = sequelize.define('whitelistWord', {
		word: DataTypes.STRING,
		serverID: DataTypes.BIGINT
	}, {});
	whitelistWord.associate = function(models) {
		// associations can be defined here
	};
	return whitelistWord;
};