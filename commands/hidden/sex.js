const { Command } = require('discord-akairo');

class sexCommand extends Command {
	constructor() {
		super('sex', {
			aliases: ['sex'],
			category: 'hidden',
			description: {
				content: 'sex',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message) {
		message.channel.send('69\nHaha lol Le sex numbers xDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD');
	}
}

module.exports = sexCommand;