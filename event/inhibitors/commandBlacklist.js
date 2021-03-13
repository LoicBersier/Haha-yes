const { Inhibitor } = require('discord-akairo');
const Blacklists = require('../../models').Blacklists;

class commandblacklistInhibitor extends Inhibitor {
	constructor() {
		super('commandblacklist', {
			reason: 'commandblacklist'
		});
	}

	async exec(message, command) {
		const blacklist = await Blacklists.findOne({where: {type:command.id, uid:message.author.id}});

		if (blacklist) return true;
	}
}

module.exports = commandblacklistInhibitor;