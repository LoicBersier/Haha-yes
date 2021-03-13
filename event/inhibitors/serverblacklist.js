const { Inhibitor } = require('discord-akairo');
const Blacklists = require('../../models').Blacklists;

class serverblacklistInhibitor extends Inhibitor {
	constructor() {
		super('serverblacklist', {
			reason: 'serverblacklist',
		});
	}

	async exec(message) {
		if (message.channel.type == 'dm') return;

		const blacklist = await Blacklists.findOne({where: {type:'guild', uid:message.guild.id}});

		if (blacklist) return true;

	}
}

module.exports = serverblacklistInhibitor;
