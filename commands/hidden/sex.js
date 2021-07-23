const { Command } = require('discord-akairo');

class sexCommand extends Command {
	constructor() {
		super('sex', {
			aliases: ['sex', '69'],
			category: 'hidden',
			description: {
				content: 'sex',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message) {
		return message.reply('69\nHaha lol Le sex numbers xDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD');
	}
}

module.exports = sexCommand;