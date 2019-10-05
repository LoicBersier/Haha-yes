const { Inhibitor } = require('discord-akairo');

class serverblacklistInhibitor extends Inhibitor {
	constructor() {
		super('serverblacklist', {
			reason: 'serverblacklist'
		});
	}

	async exec(message) {
		const blacklist = ['595100178915262464', '630127127450091521', '630128971576770580'];
		return blacklist.includes(message.guild.id);
	}
}

module.exports = serverblacklistInhibitor;