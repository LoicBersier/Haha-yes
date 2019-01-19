const { Inhibitor } = require('discord-akairo');

class serverblacklistInhibitor extends Inhibitor {
	constructor() {
		super('serverblacklist', {
			reason: 'serverblacklist'
		});
	}

	async exec(message) {
		const blacklist = [];
		return blacklist.includes(message.guild.id);
	}
}

module.exports = serverblacklistInhibitor;