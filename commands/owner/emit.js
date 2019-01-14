const { Command } = require('discord-akairo');

class emitCommand extends Command {
	constructor() {
		super('emit', {
			aliases: ['emit'],
			category: 'owner',
			ownerOnly: 'true',
			args: [
				{
					id: 'event',
					prompt: 'Wich event should i trigger?',
					type: 'string',
					match: 'rest'
				}
			],
			description: {
				content: 'Trigger an event',
				usage: '[event]',
				examples: ['ready']
			}
		});
	}

	async exec(message, args) {
		this.client.emit(`${args.event}`);
		return message.channel.send(`${args.event} has been emited!`);
	}
}

module.exports = emitCommand;