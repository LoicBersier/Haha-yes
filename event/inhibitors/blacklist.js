const { Inhibitor } = require('discord-akairo');
const Blacklists = require('../../models').Blacklists;

class BlacklistInhibitor extends Inhibitor {
	constructor() {
		super('blacklist', {
			reason: 'blacklist'
		});
	}

	async exec(message) {

		const blacklist = await Blacklists.findOne({where: {type:'global', uid:message.author.id}});

		if (blacklist) return true;
	}
}

module.exports = BlacklistInhibitor;