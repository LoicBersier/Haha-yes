const { Inhibitor } = require('discord-akairo');

class BlacklistInhibitor extends Inhibitor {
	constructor() {
		super('blacklist', {
			reason: 'blacklist'
		});
	}

	async exec(message) {
		const blacklist = ['501856229123948545', '497730155691638784', '215681880899584000', '29476879240658944'];
		return blacklist.includes(message.author.id);
	}
}

module.exports = BlacklistInhibitor;