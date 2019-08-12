const { Command } = require('discord-akairo');

class fakebotCommand extends Command {
	constructor() {
		super('fakebot', {
			aliases: ['fakebot', 'fakeuser', 'fakemember'],
			category: 'fun',
			clientPermissions: ['MANAGE_WEBHOOKS'],
			args: [
				{
					id: 'member',
					type: 'user',
					prompt: {
						start: 'Who should i fake?',
					}
				},
				{
					id: 'message',
					type: 'string',
					prompt: {
						start: 'What message should i send?',
					},
					match: 'rest',
				}
			],
			description: {
				content: 'Fake a bot/user with webhook',
				usage: '[user] [message]',
				examples: ['Supositware#1616 hello!']
			}
		});
	}

	async exec(message, args) {
		message.channel.createWebhook(args.member.username, args.member.displayAvatarURL())
			.then(webhook => {
				webhook.edit({
					name: args.member.username,
					avatar: args.member.displayAvatarURL()
				});
				this.client.fetchWebhook(webhook.id, webhook.token)
					.then(webhook => {
						message.delete();
						webhook.send(args.message);
						setTimeout(() => {
							webhook.delete();
						}, 3000);
					});
			});
	}
}
module.exports = fakebotCommand;