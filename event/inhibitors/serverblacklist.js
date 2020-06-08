const { Inhibitor } = require('discord-akairo');
const guildBlacklist = require('../../models').guildBlacklist;

class serverblacklistInhibitor extends Inhibitor {
	constructor() {
		super('serverblacklist', {
			reason: 'serverblacklist',
		});
	}

	async exec(message) {
		if (message.channel.type == 'dm') return;
		const blacklist = await guildBlacklist.findOne({where: {guildID:message.guild.id}});

		if (blacklist) return true;

	}
}

module.exports = serverblacklistInhibitor;
