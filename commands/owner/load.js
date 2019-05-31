const { Command } = require('discord-akairo');

class loadCommand extends Command {
	constructor() {
		super('load', {
			aliases: ['load'],
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
				content: 'load command',
				usage: '[command]',
				examples: ['utility/ping.js']
			}
		});
	}

	async exec(message, args) {
		if (this.handler.load(`${__dirname}/../${args.command}`)) {
			return message.channel.send(`Sucessfully loaded command ${args.command}`);
		} else {
			return message.channel.send(`Failed to load ${args.command}, did you point to the correct directory?`);
		}
	}
}

module.exports = loadCommand;