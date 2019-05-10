const { Command } = require('discord-akairo');
const fs = require('fs');

class unbyeCommand extends Command {
	constructor() {
		super('unbye', {
			aliases: ['unbye'],
			category: 'admin',
			channelRestriction: 'guild',
			userPermissions: ['MANAGE_CHANNELS'],
			description: {
				content: 'Delete leaving message',
				usage: '[]',
				examples: ['']
			}
		});
	}

	async exec(message) {
		fs.unlink(`./bye/${message.guild.id}.json`, (err) => {
			if (err) {
				console.error(err);
				return message.channel.send('An error has occured, there is most likely no bye/leave message set!');
			} else {
				return message.channel.send('Disabled bye/leave message');
			}
		});
	}
}

module.exports = unbyeCommand;