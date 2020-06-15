const { Command } = require('discord-akairo');
const fs = require('fs');
const fetch = require('node-fetch');

class dosentexistCommand extends Command {
	constructor() {
		super('dosentexist', {
			aliases: ['doesntexist', 'thispersondoesnotexist', 'de'],
			category: 'fun',
			clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
			description: {
				content: 'Send images from thispersondoesnotexist.com!,
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message) {
		fetch('https://thispersondoesnotexist.com/image')
			.then(res => {
				const dest = fs.createWriteStream('./asset/img/de.png');
				res.body.pipe(dest);
				dest.on('finish', () => {
					return message.channel.send({files: ['./asset/img/de.png']});
				});
			});	}
}
module.exports = dosentexistCommand;