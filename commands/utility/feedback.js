const { Command } = require('discord-akairo');
const { feedbackChannel } = require('../../config.json');
const feedbackID = require('../../json/feedbackID.json');

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
				},
				{
					id: 'reply',
					match: 'option',
					flag: '--reply',
				},
			],
			description: {
				content: 'Send feedback to the bot owner',
				usage: '[What do you want to say]',
				examples: ['Hello, i just wanted to say hi!']
			}
		});
	}

	async exec(message,args) {
		const Embed = this.client.util.embed()
			.setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
			.setTimestamp();

		if (message.guild) Embed.addField('Guild', `${message.guild.name} (${message.guild.id})`, true);

		Embed.addField('Feedback', args.text);

		if (feedbackID[args.reply]) {
			Embed.addField('Responding to', feedbackID[args.reply]);
		}

		// Don't let new account use this command to prevent spam, if they have an UUID its fine to skip it
		let date = new Date();
		if (message.author.createdAt > date.setDate(date.getDate() - 7)) {
			return message.reply('Your account is too new to be able to use this command!');
		}

		const channel = this.client.channels.resolve(feedbackChannel);

		let Attachment = (message.attachments).array();
		if (Attachment[0])
			Embed.setImage(Attachment[0].url);

		channel.send({embed: Embed});

		message.reply('Your feedback has been sent! Don\'t forget to have dm open if you want to get an answer from the dev!');
	}
}

module.exports = FeedbackCommand;