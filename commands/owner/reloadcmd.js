const { Command } = require('discord-akairo');

class reloadcmdCommand extends Command {
	constructor() {
		super('reloadcmd', {
			aliases: ['reloadcmd'],
			category: 'owner',
			ownerOnly: 'true',
			args: [
				{
					id: 'command',
					type: 'string',
					match: 'rest'
				}
			],
			description: {
				content: 'reload command',
				usage: '[command]',
				examples: ['ping']
			}
		});
	}

	async exec(message, args) {
		this.handler.reload(args.command);
		return message.channel.send(`successfully reloaded command ${args.command}`);
	}
}

module.exports = reloadcmdCommand;