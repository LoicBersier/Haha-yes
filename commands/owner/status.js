const { Command } = require('discord-akairo');

class StatusCommand extends Command {
	constructor() {
		super('status', {
			aliases: ['status'],
			category: 'owner',
			ownerOnly: 'true',
			args: [
				{
					id: 'status',
					prompt: 'Wich status should i have?',
					type: 'string',
					match: 'rest'
				}
			],
			description: {
				content: 'Change the status of the bot',
				usage: '[status]',
				examples: ['Hello world!']
			}
		});
	}

	async exec(message, args) {
		this.client.user.setActivity(args.status);
		message.channel.send(`Status have been set to ${args.status}`);
	}
}

module.exports = StatusCommand;