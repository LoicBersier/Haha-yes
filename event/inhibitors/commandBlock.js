const { Inhibitor } = require('discord-akairo');
const commandblock = require('../../models').commandBlock;

class commandblockInhibitor extends Inhibitor {
	constructor() {
		super('commandblock', {
			reason: 'commandblock'
		});
	}

	async exec(message, command) {
		if (message.channel.type == 'dm' || message.author.id == this.client.ownerID || message.member.hasPermission('ADMINISTRATOR')) return false;
		const blacklist = await commandblock.findOne({where: {serverID:message.guild.id, command: command.id}});

		if (blacklist) return true;
	}
}

module.exports = commandblockInhibitor;