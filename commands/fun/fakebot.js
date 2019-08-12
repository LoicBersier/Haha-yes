const { Command } = require('discord-akairo');
const fs = require('fs');

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
						start: 'What message shoudl i send?',
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
		if (!fs.existsSync(`./webhook/${message.guild.id}.json`)) {
			message.channel.createWebhook('fakebot')
				.then(webhook => {
					fs.writeFile(`./webhook/${message.guild.id}.json`, `{"id": "${webhook.id}", "token": "${webhook.token}"}`, function (err) {
						if (err) {
							console.log(err);
						}
						sendWebhook(this.client);
					});
				});
		} else {
			sendWebhook(this.client);
		}

		function sendWebhook(client) {
			let webhook = require(`../../webhook/${message.guild.id}.json`);
			client.fetchWebhook(webhook.id, webhook.token)
				.then(webhook => {
					webhook.edit({
						name: args.member.username,
						avatar: args.member.displayAvatarURL()
					});
					return webhook.send(args.message);
				});
		}
	}
}
module.exports = fakebotCommand;