const { Command } = require('discord-akairo');
const fs = require('fs');

class byeCommand extends Command {
	constructor() {
		super('bye', {
			aliases: ['bye', 'leave'],
			category: 'admin',
			channelRestriction: 'guild',
			userPermissions: ['MANAGE_CHANNELS'],
			clientPermissions: ['SEND_MESSAGES'],
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
					default: '[member] just left the server :('
				}
			],
			description: {
				content: 'Send a message to the current channel when a person leave, you can use [member] to show the member username and [server] to show the name of the server',
				usage: '[bye message]',
				examples: ['[member] left the server, he deserve a ban']
			}
		});
	}

	async exec(message, args) {
		let byeChannel = message.channel.id;

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

		fs.writeFile(`./bye/${message.guild.id}.json`, `{"channel": "${byeChannel}", "message": "${args.message}"}`, function (err) {
			if (err) {
				console.log(err);
				return message.channel.send('An error has occured! im gonna be honest with you, i do not know what happened yet! but fear not! i will look into it!');
			}
		});
		
		return message.channel.send(`This channel will now be used to send message when user leave with the following message: ${args.message}`);
	}
}

module.exports = byeCommand;