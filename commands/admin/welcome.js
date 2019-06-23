const { Command } = require('discord-akairo');
const fs = require('fs');

class welcomeCommand extends Command {
	constructor() {
		super('welcome', {
			aliases: ['welcome'],
			category: 'admin',
			channelRestriction: 'guild',
			userPermissions: ['MANAGE_CHANNELS'],
			args: [
				{
					id: 'message',
					type: 'string',
					match: 'rest',
					prompt: {
						start: 'What message do you want to welcome peoples?',
					}
				}
			],
			description: {
				content: 'Send a message to the current channel when a person join, you can use [member] to show the member username and [server] to show the name of the server',
				usage: '[welcome message]',
				examples: ['everyone welcome [adjectives] [member] and welcome on [server]']
			}
		});
	}

	async exec(message, args) {
		let welcomeChannel = message.channel.id;

		fs.writeFile(`./welcome/${message.guild.id}.json`, `{"channel": "${welcomeChannel}", "message": "${args.message}"}`, function (err) {
			if (err) {
				console.log(err);
			}
		});
		
		return message.channel.send(`This channel will now be used to welcome new user with the following message: ${args.message}`);
	}
}

module.exports = welcomeCommand;