const { Command } = require('discord-akairo');

class premiumCommand extends Command {
	constructor() {
		super('premium', {
			aliases: ['premium'],
			prefix: '!',
			category: 'hidden',
			description: {
				content: 'premium',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message) {
		return message.reply('EPIC TF2 FEATURE HERE !!!!!!111111 YOU CAN FLY AND CHEAT !!!!!!!!!!!!!!!!! ALSO PREMIUM SONG AND ANNOY EVERYONE AND FLEX ON EM HATERS WITH CUSTOM SKIN!!!!');
	}
}

module.exports = premiumCommand;