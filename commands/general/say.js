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
				content: 'Repeat what you say, [Click here to see the complete list of "tag"](https://cdn.discordapp.com/attachments/502198809355354133/561043193949585418/unknown.png)',
				usage: '[text]',
				examples: ['[member] is a big [adverbs] [verbs]']
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