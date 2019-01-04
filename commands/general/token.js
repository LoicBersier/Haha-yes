const { Command } = require('discord-akairo');

class tokenCommand extends Command {
	constructor() {
		super('token', {
			aliases: ['token'],
			category: 'general',
			description: {
				content: 'Send the token of the bot',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message) {
		let trollMessage = ['Sick you thought <:youngtroll:488559163832795136>', 'Haha nope\nOWNED EPIC STYLE <:youngtroll:488559163832795136>', 'NDg3MzQyOD__NOPE__pkz5_ck', 'Did you think i was that dumb?'];
		trollMessage = trollMessage[Math.floor( Math.random() * trollMessage.length )];
		message.channel.send(trollMessage);
	}
}
module.exports = tokenCommand;