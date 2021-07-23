const { Command } = require('discord-akairo');

class randomizerCommand extends Command {
	constructor() {
		super('randomizer', {
			aliases: ['randomizer'],
			category: 'general',
			clientPermissions: ['SEND_MESSAGES'],
			args: [
				{
					id: 'text',
					type: 'string',
					prompt: {
						start: 'Need words to randomize',
					},
					match: 'rest'
				}
			],
			description: {
				content: 'Choose one random word',
				usage: '[multiples words]',
				examples: ['Hello bye']
			}
		});
	}

	async exec(message, args) {
		let words = args.text.split(' ');

		return message.reply(words[Math.floor((Math.random() * words.length))]);
	}
}

module.exports = randomizerCommand;