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
					prompt: {
						start: 'Write something so i can say it back',
					},
					match: 'rest'
				}
			],
			description: {
				content: 'Repeat what you say but delete the text you sent, [Click here to see the complete list of "tag"](https://cdn.discordapp.com/attachments/502198809355354133/561043193949585418/unknown.png)',
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
		message.delete();
		return message.util.send('===ANTI-SNIPE MESSAGE===')
			.then(() => {
				message.util.edit(text);
			});
	}
}

module.exports = SaydCommand;