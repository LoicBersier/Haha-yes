const { Command } = require('discord-akairo');

class fakebotCommand extends Command {
	constructor() {
		super('fakebot', {
			aliases: ['fakebot', 'fakeuser', 'fakemember'],
			category: 'fun',
			clientPermissions: ['MANAGE_WEBHOOKS'],
			args: [
				{
					id: 'user',
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
		let Attachment = (message.attachments).array();
		let url;
		let username = args.user.username;
		// Get attachment link
		if (Attachment[0]) {
			url = Attachment[0].url;
		}
		// Show nickname if user is in guild
		if (message.guild.members.get(args.user.id).nickname) {
			username = message.guild.members.get(args.user.id).nickname;
		}
		
		message.channel.createWebhook(username, {
			avatar: args.user.displayAvatarURL(),
			reason: `Fakebot/user command triggered by: ${message.author.username}`
		})
			.then(webhook => {
				// Have to edit after creation otherwise the picture doesn't get applied
				webhook.edit({
					name: username,
					avatar: args.user.displayAvatarURL(),
					reason: `Fakebot/user command triggered by: ${message.author.username}`
				});
				this.client.fetchWebhook(webhook.id, webhook.token)
					.then(webhook => {
						message.delete();
						
						if (url)
							webhook.send(args.message, {files: [url]});
						else
							webhook.send(args.message);

						setTimeout(() => {
							webhook.delete({
								reason: `Fakebot/user command triggered by: ${message.author.username}`
							});
						}, 3000);
					});
			});
	}
}
module.exports = fakebotCommand;