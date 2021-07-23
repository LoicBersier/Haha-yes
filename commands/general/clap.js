const { Command } = require('discord-akairo');
const rand = require('../../rand.js');
class ClapCommand extends Command {
	constructor() {
		super('clap', {
			aliases: ['clap'],
			category: 'general',
			clientPermissions: ['SEND_MESSAGES'],
			args: [
				{
					id: 'text',
					type: 'string',
					prompt: {
						start: 'Write something so i can replace the space with 👏',
					},
					match: 'rest'
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
		args.text = rand.random(args.text, message);
		
		let clap = args.text.replace(/ /g, ' 👏 ');
		message.reply(`${clap} 👏`);
	}
}

module.exports = ClapCommand;