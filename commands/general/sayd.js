const { Command } = require('discord-akairo');
const rand = require('../../rand.js');

class SaydCommand extends Command {
	constructor() {
		super('sayd', {
			aliases: ['sayd'],
			category: 'general',
			clientPermissions: 'MANAGE_MESSAGES',
			args: [
				{
					id: 'text',
					type: 'string',
					match: 'rest'
				}
			],
			description: {
				content: 'Repeat what you say but delete the text you sent',
				usage: '[text]',
				examples: ['[member] is a big [adverbs] [verb]']
			}
		});
	}

	async exec(message, args) {
		let text = args.text;
		if (!text)
			return;

		text = rand.random(text, message);		

		//	  Send the final text
		message.delete();
		return message.util.send('===ANTI-SNIPE MESSAGE===')
			.then(() => {
				message.util.edit(text);
			});
	}
}

module.exports = SaydCommand;