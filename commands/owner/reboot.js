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
		await message.channel.send('k bye thx', { files: ['https://cdn.discordapp.com/attachments/532980995767533568/553310025792356362/meme.png']});
		process.exit();

	}
}

module.exports = RebootCommand;