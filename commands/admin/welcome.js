const { Command } = require('discord-akairo');
const fs = require('fs');

class welcomeCommand extends Command {
	constructor() {
		super('welcome', {
			aliases: ['welcome', 'join'],
			category: 'admin',
			channelRestriction: 'guild',
			userPermissions: ['MANAGE_CHANNELS'],
			args: [
				{
					id: 'remove',
					match: 'flag',
					flag: '--remove'
				},
				{
					id: 'message',
					type: 'string',
					match: 'rest',
					default: 'Welcome [member] to [server]!'
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

		if (args.remove) {
			fs.unlink(`./welcome/${message.guild.id}.json`, (err) => {
				if (err) {
					console.error(err);
					return message.channel.send('An error has occured, there is most likely no welcome message set!');
				} else {
					return message.channel.send('Disabled unwelcome message');
				}
			});
		}

		fs.writeFile(`./welcome/${message.guild.id}.json`, `{"channel": "${welcomeChannel}", "message": "${args.message}"}`, function (err) {
			if (err) {
				console.log(err);
				return message.channel.send('An error has occured! im gonna be honest with you, i do not know what happened yet! but fear not! i will look into it!');
			}
		});
		
		return message.channel.send(`This channel will now be used to welcome new user with the following message: ${args.message}`);
	}
}

module.exports = welcomeCommand;