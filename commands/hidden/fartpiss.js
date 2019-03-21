const { Command } = require('discord-akairo');

class fartpissCommand extends Command {
	constructor() {
		super('fartpiss', {
			aliases: ['fartpiss'],
			category: 'hidden',
			args: [
				{
					id: 'member',
					type: 'member'
				}
			],
			description: {
				content: 'fartpiss',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message, args) {
		args.member.setNickname('fart pis');
		message.channel.send('fart piss <:youngtroll:488559163832795136>');
	}
}

module.exports = fartpissCommand;