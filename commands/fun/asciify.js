const { Command } = require('discord-akairo');
const attachment = require('../../utils/attachment');
const os = require('os');
const fs = require('fs');
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
			args: [
				{
					id: 'link',
					type: 'url',
				}
			],
			cooldown: 600000,
			ratelimit: 2,
			description: {
				content: 'Transform your image into ASCII! (This can be a bit spammy, so be careful!)',
				usage: '[image in attachment]',
				examples: ['image in attachment']
			}
		});
	}

	async exec(message, args) {
		let url;

		if (args.link)
			url = args.link.href;
		else
			url = await attachment(message);

		return asciify(url, options, function (err, asciified) {
			if (err) throw err;   
			// Print to console
			fs.writeFile(`${os.tmpdir()}/${message.id}ascii.txt`, asciified, function (err) {
				if (err) {
					console.log(err);
				}

				return message.channel.send({files: [`${os.tmpdir()}/${message.id}ascii.txt`]});
			});
			//return message.channel.send(asciified,  { split: true, code: true });
		});
	}
}
module.exports = asciifyCommand;