const { Command } = require('discord-akairo');

class reloadlistenerCommand extends Command {
	constructor() {
		super('reloadlistener', {
			aliases: ['reloadlistener'],
			category: 'owner',
			ownerOnly: 'true',
			args: [
				{
					id: 'listener',
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
		this.client.listenerHandler.reload(args.listener);
		return message.channel.send(`successfully reloaded listener ${args.listener}`);
	}
}

module.exports = reloadlistenerCommand;