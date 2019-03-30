const { Command } = require('discord-akairo');
const fs = require('fs');
const fetch = require('node-fetch');

class dosentexistCommand extends Command {
	constructor() {
		super('dosentexist', {
			aliases: ['dosentexist', 'thispersondoesnotexist', 'de'],
			category: 'fun',
			description: {
				content: 'Send images from thispersondoesnotexist.com',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message) {
		fetch('https://thispersondoesnotexist.com/image')
			.then(res => {
				const dest = fs.createWriteStream('./img/de.png');
				res.body.pipe(dest);
				dest.on('finish', () => {
					return message.channel.send({files: ['./img/de.png']});
				});
			});	}
}
module.exports = dosentexistCommand;