const { Command } = require('discord-akairo');

class dominoCommand extends Command {
	constructor() {
		super('domino', {
			aliases: ['domino'],
			category: 'hidden',
			args: [
				{
					id: 'number',
					type: 'integer',
					default: 10
				}
			],
			description: {
				content: 'domino',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message, args) {
		let domino = 'I';

		message.util.send(domino.repeat(args.number))
			.then(function () {
				setTimeout(function () {
					message.util.edit('| /' + domino.replace('I', ' _/_ '.repeat(args.number - 3)) + '__');
				}, 1000);
			});
	}
}

module.exports = dominoCommand;