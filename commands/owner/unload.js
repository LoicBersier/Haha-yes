const { Command } = require('discord-akairo');

class unloadCommand extends Command {
	constructor() {
		super('unload', {
			aliases: ['unload'],
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
				content: 'Unload command',
				usage: '[command]',
				examples: ['ping']
			}
		});
	}

	async exec(message, args) {
		this.handler.remove(args.command);
		return message.channel.send(`Sucessfully unloaded command ${args.command}`);
	}
}

module.exports = unloadCommand;