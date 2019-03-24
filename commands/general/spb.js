const { Command } = require('discord-akairo');
const fs = require('fs');
const fetch = require('node-fetch');

class spbCommand extends Command {
	constructor() {
		super('spb', {
			aliases: ['spb'],
			category: 'general',
			args: [
				{
					id: 'link',
					type: 'string'
				}
			],
			description: {
				content: 'Generate a meme from template you send with spb5k (ONLY WORK WITH TEMPLATES)',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message, args) {
		if (!args.link || !args.link.includes('shitpostbot.com/template/')) {
			return message.channel.send('Need a Shitpostbot 5000 template link!\nYou can find them here! <https://www.shitpostbot.com/gallery/templates>');
		}

		let link = args.link.replace('template', 'preview');

		fetch(link)
			.then(res => {
				const dest = fs.createWriteStream('./img/spb.png');
				res.body.pipe(dest);
				dest.on('finish', () => {
					return message.channel.send({files: ['./img/spb.png']});
				});
			});
	}
}

module.exports = spbCommand;