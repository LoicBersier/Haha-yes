const fetch = require('node-fetch');
const { Hapi } = require('../config.json');

module.exports = async function () {
	if (Hapi) {
		var res = await fetch(Hapi);
		return res.status === 200;
	} else
		return false;
};