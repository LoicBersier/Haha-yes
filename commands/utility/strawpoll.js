const { Command } = require('discord-akairo');
const fetch = require('node-fetch');

class SayCommand extends Command {
	constructor() {
		super('strawpoll', {
			aliases: ['strawpoll', 'poll'],
			category: 'general',
			args: [
				{
					id: 'title',
					type: 'string',
					prompt: {
						start: 'What should the title of the poll be?',
					},
				},
				{
					id: 'options',
					type: 'string',
					prompt: {
						start: 'What the options should be?',
					},
					match: 'rest'
				},
				{
					id: 'multi',
					match: 'flag',
					flag:  '--multi'
				}
			],
			description: {
				content: 'Simply create strawpoll ( use | to separate the options )',
				usage: '[title] [options]',
				examples: ['"am i cool?" hell yea | nah | you suck!']
			}
		});
	}

	async exec(message, args) {
		let options = args.options.trim().split('|');


		let request = {
			'title': args.title,
			'options': options,
			'multi': args.multi
		};

		console.log(JSON.stringify(request));

		fetch('https://www.strawpoll.me/api/v2/polls', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(request),
		}).then((response) => {
			return response.json();
		}).then((response) => {
			return message.channel.send(` Your strawpoll is ready! https://www.strawpoll.me/${response.id}`);
		});
	}
}

module.exports = SayCommand;