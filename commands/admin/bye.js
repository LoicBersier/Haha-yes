const { Command } = require('discord-akairo');
const fs = require('fs');

class byeCommand extends Command {
	constructor() {
		super('bye', {
			aliases: ['bye'],
			category: 'admin',
			channelRestriction: 'guild',
			userPermissions: ['MANAGE_CHANNELS'],
			args: [
				{
					id: 'message',
					type: 'string',
					match: 'rest'
				}
			],
			description: {
				content: 'Set bye message when user leave/get kicked, can use [member] to get the name of the user joining and [server] to get the name of the server',
				usage: '[bye message]',
				examples: ['[member] leaved the server, he deserve a ban']
			}
		});
	}

	async exec(message, args) {
		let byeChannel = message.channel.id;

		fs.writeFile(`./bye/${message.guild.id}.json`, `{"channel": "${byeChannel}", "message": "${args.message}"}`, function (err) {
			if (err) {
				console.log(err);
			}
		});
		
		return message.channel.send(`This channel will now be used to send message when user leave with the following message: ${args.message}`);
	}
}

module.exports = byeCommand;