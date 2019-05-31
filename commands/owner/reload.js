const { Command } = require('discord-akairo');

class reloadCommand extends Command {
	constructor() {
		super('reload', {
			aliases: ['reload'],
			category: 'owner',
			ownerOnly: 'true',
			args: [
				{
					id: 'command',
					type: 'string',
					match: 'rest'
				}
			],
			description: {
				content: 'reload command',
				usage: '[command]',
				examples: ['ping']
			}
		});
	}

	async exec(message, args) {
		this.handler.reload(args.command);
		return message.channel.send(`Sucessfully reloaded command ${args.command}`);
	}
}

module.exports = reloadCommand;