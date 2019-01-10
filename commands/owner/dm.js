const { Command } = require('discord-akairo');

class EvalCommand extends Command {
	constructor() {
		super('dm', {
			aliases: ['dm', 'pm'],
			category: 'owner',
			args: [
				{
					id: 'user',
					type: 'user'
				},
				{
					id: 'text',
					type: 'string',
					match: 'rest'
				}
			],
			ownerOnly: 'true',
			description: {
				content: 'DM users',
				usage: '[user id] [message]',
				examples: ['267065637183029248 hello i recived your feedback and...']
			}
		});
	}

	async exec(message, args) {
		let user = args.user;
		let text = args.text;

		let Attachment = (message.attachments).array();
		if (Attachment[0]) {
			this.client.users.get(user).send(`**Message from the dev:**\n${text}\n${Attachment[0].url}`);
			message.channel.send(`DM sent to ${user.username}`);
		}
		else {
			this.client.users.get(user.id).send(`**Message from the dev:**\n${text}`);
			message.channel.send(`DM sent to ${user.username}`);
		}

	}
}

module.exports = EvalCommand;