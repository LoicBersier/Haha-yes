const { Inhibitor } = require('discord-akairo');
const userBlacklist = require('../../models').userBlacklist;

class BlacklistInhibitor extends Inhibitor {
	constructor() {
		super('blacklist', {
			reason: 'blacklist'
		});
	}

	async exec(message) {
		//const blacklist = ['501856229123948545', '497730155691638784', '29476879240658944', '530399670728392737', '595102888796356628', '342039250302140418', '319180626928336896', '476412819278004236'];
		
		const blacklist = await userBlacklist.findOne({where: {userID:message.author.id}});

		if (blacklist) return true;
	}
}

module.exports = BlacklistInhibitor;