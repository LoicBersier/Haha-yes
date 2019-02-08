const { Command } = require('discord-akairo');
const rand = require('../../rand.js');

class SayCommand extends Command {
	constructor() {
		super('say', {
			aliases: ['say'],
			category: 'general',
			args: [
				{
					id: 'text',
					type: 'string',
					match: 'rest'
				}
			],
			description: {
				content: 'Repeat what you say but can also replace ',
				usage: '[text]',
				examples: ['[member] is a big [adverb] [verb]']
			}
		});
	}

	async exec(message, args) {
		let text = args.text;
		if (!text)
			return;

		text = rand.random(text, message);		

		//	  Send the final text
		return message.channel.send(text);
	}
}

module.exports = SayCommand;