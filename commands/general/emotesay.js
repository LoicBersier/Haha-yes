const { Command } = require('discord-akairo');
const emojiCharacters = require('../../emojiCharacters');

class EmotesayCommand extends Command {
	constructor() {
		super('emotesay', {
			aliases: ['emotesay', 'esay'],
			category: 'general',
			split: 'none',
			args: [
				{
					id: 'text',
					type: 'string'
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
		
		message.delete();
		let emojiArray = [];
		for (let i = 0; i < text.length; i++)
			emojiArray[i] = emojiCharacters[text.toLowerCase().split('')[i]];
		message.channel.send(emojiArray.join(''));
	}
}

module.exports = EmotesayCommand;