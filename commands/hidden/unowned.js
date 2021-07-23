const { Command } = require('discord-akairo');

class unownedCommand extends Command {
	constructor() {
		super('unowned', {
			aliases: ['unowned'],
			category: 'hidden',
			args: [
				{
					id: 'member',
					type: 'string',
					match: 'rest'
				}
			],
			description: {
				content: 'unowned',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message, args) {
		if (args.member) {
			return message.reply('You can\'t do that! that\'s illegal!');
		}
		if (message.author.id == '267065637183029248') {
			return message.reply('You have been sucessfully unowned');
		}
		return message.reply('You can\'t unown what has already been owned <:classictroll:488559136494321703>');
	}
}

module.exports = unownedCommand;