const { Command } = require('discord-akairo');
const { feedbackChannel } = require('../../config.json');

class FeedbackCommand extends Command {
	constructor() {
		super('feedback', {
			aliases: ['feedback'],
			category: 'utility',
			split: 'none',
			args: [
				{
					id: 'text',
					type: 'string'
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
		let text = args.text;

		const channel = this.client.channels.get(feedbackChannel);
		channel.send(`from ${message.author.username} (${message.author.id}) : ${text}`);
		message.channel.send('Your feedback has been sent!');
	}
}

module.exports = FeedbackCommand;