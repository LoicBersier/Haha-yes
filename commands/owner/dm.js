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
			this.client.users.resolve(user.id).send(`**Message from the dev:**\n${text}\n**If you wish to respond use the feedback command**`, {files: [Attachment[0].url]})
				.then(() => {
					return message.channel.send(`DM sent to ${user.username}`);
				})
				.catch(() => {
					return message.channel.send(`Could not send a DM to ${user.username}`);
				});
		}
		else {
			this.client.users.resolve(user.id).send(`**Message from the dev:**\n${text}\n**If you wish to respond use the feedback command**`)
				.then(() => {
					return message.channel.send(`DM sent to ${user.username}`);
				})
				.catch(() => {
					return message.channel.send(`Could not send a DM to ${user.username}`);
				});
		}

	}
}

module.exports = EvalCommand;