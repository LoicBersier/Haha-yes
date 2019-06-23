const { Command } = require('discord-akairo');
const emojiCharacters = require('../../emojiCharacters');
const rand = require('../../rand.js');

class EmotesayCommand extends Command {
	constructor() {
		super('emotesay', {
			aliases: ['emotesay', 'esay'],
			category: 'general',
			args: [
				{
					id: 'text',
					type: 'string',
					prompt: {
						start: 'Write something so i can replace the space with dancing emote',
					},
					match: 'rest'
				}
			],
			description: {
				content: 'Replace the text you send with dancing letters',
				usage: '[text]',
				examples: ['Hello']
			}
		});
	}

	async exec(message, args) {
		let text = args.text;
		if (!text)
			return;
	
		text = rand.random(text, message);

		message.delete();
		let emojiArray = [];
		for (let i = 0; i < text.length; i++)
			emojiArray[i] = emojiCharacters[text.toLowerCase().split('')[i]];
		message.channel.send(emojiArray.join(''));
	}
}

module.exports = EmotesayCommand;