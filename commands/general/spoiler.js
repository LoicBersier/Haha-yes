const { Command } = require('discord-akairo');

class spoilerCommand extends Command {
	constructor() {
		super('spoiler', {
			aliases: ['spoiler'],
			category: 'general',
			args: [
				{
					id: 'text',
					type: 'string',
					prompt: {
						start: 'Write something so i can say it back in spoiler',
					},
					match: 'rest'
				}
			],
			description: {
				content: 'Replace every letter in your text with letter spoiler',
				usage: 'this is epic',
				examples: ['this is epic']
			}
		});
	}

	async exec(message, args) {
		let text = args.text;
		if (!text)
			return;

		text = text.split('').join('||||');

		//	  Send the final text
		message.delete();
		return message.channel.send('||' + text + '||');
	}
}

module.exports = spoilerCommand;