const { Inhibitor } = require('discord-akairo');

class BlacklistInhibitor extends Inhibitor {
	constructor() {
		super('blacklist', {
			reason: 'blacklist'
		});
	}

	async exec(message) {
		const blacklist = ['501856229123948545', '497730155691638784', '29476879240658944', '294768792406589440', '530399670728392737', '595102888796356628', '342039250302140418', '319180626928336896'];
		return blacklist.includes(message.author.id);
	}
}

module.exports = BlacklistInhibitor;