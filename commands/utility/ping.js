const { Command } = require('discord-akairo');

class PingCommand extends Command {
	constructor() {
		super('ping', {
			aliases: ['ping', 'hello'],
			category: 'utility',
			args: [
				{
					id: 'lazyping',
					type: 'string',
				}
			],
			description: {
				content: 'Ping the bot',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message, args) {
		if (args.lazyping) return message.channel.send('Ping him yourself you lazy ass');
		return message.util.reply('Pong!').then(sent => {
			const timeDiff = (sent.editedAt || sent.createdAt) - (message.editedAt || message.createdAt);
			const text = `🔂\u2000**PING**: ${timeDiff} ms`;
			return message.util.reply(`Pong!\n${text}`);
		});
	}
}

module.exports = PingCommand;