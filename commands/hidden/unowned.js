const { Command } = require('discord-akairo');

class unownedCommand extends Command {
	constructor() {
		super('unowned', {
			aliases: ['unowned'],
			category: 'hidden',
			description: {
				content: 'unowned',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message) {
		message.channel.send('You can\'t unown what has already been owned <:classictroll:488559136494321703>');
	}
}

module.exports = unownedCommand;