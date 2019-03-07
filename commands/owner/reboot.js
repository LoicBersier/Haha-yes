const { Command } = require('discord-akairo');

class RebootCommand extends Command {
	constructor() {
		super('reboot', {
			aliases: ['ded', 'reboot', 'restart'],
			split: 'none',
			category: 'owner',
			ownerOnly: 'true',
			description: {
				content: 'Restart the bot',
				usage: '[]',
				examples: ['']
			}
		});
	}

	async exec(message) {
		await message.channel.send('k bye thx', { files: ['https://cdn.discordapp.com/attachments/488557139732856832/553304488660959252/Untitled-1.png']});
		process.exit();

	}
}

module.exports = RebootCommand;