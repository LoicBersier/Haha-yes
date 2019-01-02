const { Command } = require('discord-akairo');
const fetch = require('node-fetch');

class InspiroBotCommand extends Command {
	constructor() {
		super('InspiroBot', {
			aliases: ['inspirobot', 'ib'],
			category: 'general',
			description: {
				content: 'Send images from Inspirobot',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message) {
		fetch('http://inspirobot.me/api?generate=true')
			.then(res => res.text())
			.then(body => message.channel.send({files: [body]}));
	}
}
module.exports = InspiroBotCommand;