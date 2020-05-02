const { Command } = require('discord-akairo');
const { prefix } = require('../../config.json');
const feedbackID = require('../../json/feedbackID.json');

class dmCommand extends Command {
	constructor() {
		super('dm', {
			aliases: ['dm', 'pm'],
			category: 'owner',
			args: [
				{
					id: 'user',
					type: 'string'
				},
				{
					id: 'text',
					type: 'string',
					prompt: {
						start: 'What do you want to send to that user?',
					},
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
		function uuidv4() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});
		}

		const uuid = uuidv4();
		feedbackID[uuid] = args.text;

		let user = this.client.users.resolve(args.user);
		if (!user) return message.channel.send('Not a valid ID');
		let text = args.text;

		const Embed = this.client.util.embed()
			.setTitle('You received a message from the developer!')
			.setDescription(text)
			.setFooter(`If you wish to respond use the following command: ${prefix[0]}feedback --reply ${uuid} <message>`)
			.setTimestamp();

		let Attachment = (message.attachments).array();
		if (Attachment[0]) {
			this.client.users.resolve(user).send(Embed, {files: [Attachment[0].url]})
				.then(() => {
					return message.channel.send(`DM sent to ${user.username}`);
				})
				.catch(() => {
					return message.channel.send(`Could not send a DM to ${user.username}`);
				});
		}
		else {
			this.client.users.resolve(user).send(Embed)
				.then(() => {
					return message.channel.send(`DM sent to ${user.tag}`);
				})
				.catch(() => {
					return message.channel.send(`Could not send a DM to ${user.tag}`);
				});
		}

	}
}

module.exports = dmCommand;