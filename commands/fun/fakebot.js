const { Command } = require('discord-akairo');
const fs = require('fs');
const reload = require('auto-reload');

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
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message, args) {
		if (!fs.existsSync(`./webhook/${message.guild.id}_${message.channel.id}.json`)) {
			message.channel.createWebhook('fakebot')
				.then(webhook => {
					fs.writeFile(`./webhook/${message.guild.id}_${message.channel.id}.json`, `{"id": "${webhook.id}", "token": "${webhook.token}", "channel": "${message.channel.id}"}`, function (err) {
						if (err) {
							console.log(err);
						}
						return message.channel.send('Please run me again to send the message!');
					});
				});
		} else {
			let webhook = reload(`../../webhook/${message.guild.id}_${message.channel.id}.json`);
			this.client.fetchWebhook(webhook.id, webhook.token)
				.then(webhook => {
					webhook.edit({
						name: args.member.username,
						avatar: args.member.displayAvatarURL()
					});

					message.delete();
					return webhook.send(args.message);
				});
		}
	}
}
module.exports = fakebotCommand;