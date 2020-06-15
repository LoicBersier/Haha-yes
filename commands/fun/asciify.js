const { Command } = require('discord-akairo');
const asciify = require('asciify-image');

let options = {
	fit:    'box',
	width:  200,
	height: 50,
	color: false
};

class asciifyCommand extends Command {
	constructor() {
		super('asciify', {
			aliases: ['asciify'],
			category: 'fun',
			clientPermissions: ['SEND_MESSAGES'],
			cooldown: 600000,
			ratelimit: 2,
			description: {
				content: 'Transform your image into ASCII! (This can be a bit spammy, so be careful!)',
				usage: '[image in attachment]',
				examples: ['image in attachment']
			}
		});
	}

	async exec(message) {
		let Attachment = (message.attachments).array();


		return asciify(Attachment[0].url, options, function (err, asciified) {
			if (err) throw err;   
			// Print to console
			return message.channel.send(asciified,  { split: true, code: true });
		});
	}
}
module.exports = asciifyCommand;