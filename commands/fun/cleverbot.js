const { Command } = require('discord-akairo');
const cleverbot = require('cleverbot-free');

class CleverBotCommand extends Command {
	constructor() {
		super('CleverBot', {
			aliases: ['CleverBot', 'cb'],
			category: 'fun',
			clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
			args: [
				{
					id: 'message',
					type: 'string',
					prompt: {
						start: 'What do you want to say to cleverbot?'
					},
					match: 'rest'
				},
			],
			description: {
				content: 'Talk to cleverbot!',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message, args) {
		cleverbot(args.message).then(response => {
			return message.channel.send(response);
		});
	}
}
module.exports = CleverBotCommand;