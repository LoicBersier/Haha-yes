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
						retry: 'Didn\'t find any user named like that, please say the name again.'
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
		message.channel.createWebhook(args.member.username, {
			avatar: args.member.displayAvatarURL(),
			reason: `Fakebot/user command triggered by: ${message.author.username}`
		})
			.then(webhook => {
				// Have to edit after creation otherwise the picture doesn't get applied
				webhook.edit({
					name: args.member.username,
					avatar: args.member.displayAvatarURL(),
					reason: `Fakebot/user command triggered by: ${message.author.username}`
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