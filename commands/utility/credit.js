const { Command } = require('discord-akairo');

class creditCommand extends Command {
	constructor() {
		super('credit', {
			aliases: ['credit'],
			category: 'utility',
			description: {
				content: 'Show credits for the bot',
				usage: '(optional) [@user]',
				examples: ['', '@user']
			}
		});
	}

	async exec(message) {
		message.channel.send('Thanks to Tina the Cyclops girl#0064 for inspiring me making a bot,\nThanks to discord.js team for making discord.js\nThanks to 1computer1 for making discord-akairo and the help command');
	}
}

module.exports = creditCommand;