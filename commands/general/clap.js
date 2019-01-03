const { Command } = require('discord-akairo');

class ClapCommand extends Command {
	constructor() {
		super('clap', {
			aliases: ['clap'],
			category: 'general',
			split: 'none',
			args: [
				{
					id: 'text',
					type: 'string'
				}
			],
			description: {
				content: 'replace 👏 the 👏 spaces 👏 with 👏 clap 👏',
				usage: '[text]',
				examples: ['replace the spaces with clap']
			}
		});
	}

	async exec(message, args) {
		if (!args.text)
			return;
		let clap = args.text.replace(/ /g, ' 👏 ');
		message.delete();
		message.channel.send(`${clap} 👏`);
	}
}

module.exports = ClapCommand;