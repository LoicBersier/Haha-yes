const { Command } = require('discord-akairo');

class levertownedCommand extends Command {
	constructor() {
		super('levertowned', {
			aliases: ['levertowned'],
			category: 'hidden',
			description: {
				content: 'levertowned',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message) {
		return message.channel.send('Hello buddy bro <:youngtroll:488559163832795136> <@434762632004894746>');
	}
}

module.exports = levertownedCommand;