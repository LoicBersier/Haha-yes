const { Command } = require('discord-akairo');
const fs = require('fs');

class unwelcomeCommand extends Command {
	constructor() {
		super('unwelcome', {
			aliases: ['unwelcome'],
			category: 'admin',
			channelRestriction: 'guild',
			userPermissions: ['MANAGE_CHANNELS'],
			description: {
				content: 'Delete welcome message',
				usage: '[]',
				examples: ['']
			}
		});
	}

	async exec(message) {
		fs.unlink(`./welcome/${message.guild.id}.json`, (err) => {
			if (err) {
				console.error(err);
				return message.channel.send('An error has occured, there is most likely no welcome message set!');
			} else {
				return message.channel.send('Disabled unwelcome message');
			}
		});
	}
}

module.exports = unwelcomeCommand;