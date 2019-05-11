const { Command } = require('discord-akairo');

class sendfileCommand extends Command {
	constructor() {
		super('sendfile', {
			aliases: ['sendfile'],
			category: 'owner',
			ownerOnly: 'true',
			args: [
				{
					id: 'file',
					type: 'string',
					match: 'rest'
				}
			],
			description: {
				content: 'send a file from the server',
				usage: '[a file on the server]',
				examples: ['config-exemple.jsonc']
			}
		});
	}

	async exec(message, args) {
		message.channel.send('Here is your file.', {files: [args.file]}).catch(() =>{
			return message.channel.send('Could not find the requested file.');
		});
	}
}

module.exports = sendfileCommand;