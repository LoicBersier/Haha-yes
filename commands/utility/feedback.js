const { Command } = require('discord-akairo');
const { feedbackChannel } = require('../../config.json');

class FeedbackCommand extends Command {
	constructor() {
		super('feedback', {
			aliases: ['feedback'],
			category: 'utility',
			clientPermissions: ['SEND_MESSAGES'],
			args: [
				{
					id: 'text',
					type: 'string',
					prompt: {
						start: 'What do you want to say to the owner?',
					},
					match: 'rest'
				}
			],
			description: {
				content: 'Send feedback to the bot owner',
				usage: '[What do you want to say]',
				examples: ['Hello, i just wanted to say hi!']
			}
		});
	}

	async exec(message,args) {
		// Don't let account new account use this command to prevent spam
		let date = new Date();
		if (message.author.createdAt > date.setDate(date.getDate() - 7)) {
			return message.channel.send('Your account is too new to be able to use this command!');
		}

		const channel = this.client.channels.resolve(feedbackChannel);

		const Embed = this.client.util.embed()
			.setAuthor(`${message.author.username} (${message.author.id})`, message.author.displayAvatarURL());
		if (message.guild) Embed.addField('Guild', `${message.guild.name} (${message.guild.id})`, true);
		Embed.addField('Feedback', args.text)
			.setTimestamp();
		channel.send({embed: Embed});

		message.channel.send('Your feedback has been sent!');
	}
}

module.exports = FeedbackCommand;