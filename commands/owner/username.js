const { Command } = require('discord-akairo');

class usernameCommand extends Command {
	constructor() {
		super('username', {
			aliases: ['username'],
			category: 'owner',
			ownerOnly: 'true',
			args: [
				{
					id: 'username',
					prompt: 'which username should i have?',
					type: 'string',
					match: 'rest'
				}
			],
			description: {
				content: 'Change the username of the bot',
				usage: '[username]',
				examples: ['haha no']
			}
		});
	}

	async exec(message, args) {
		this.client.user.setUsername(args.username);
		message.channel.send(`The username have been changed sucessfully to ${args.username}`);
	}
}

module.exports = usernameCommand;