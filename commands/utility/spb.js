const { Command } = require('discord-akairo');
const fs = require('fs');
const fetch = require('node-fetch');

class spbCommand extends Command {
	constructor() {
		super('spb', {
			aliases: ['spb', '!spb'],
			category: 'utility',
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
		if (!args.link.includes('shitpostbot.com/template/')) {
			return message.channel.send('Need a template Shitpostbot 5000 link!');
		}

		let link = args.link.replace('template', 'preview');

		fetch(link)
			.then(res => {
				const dest = fs.createWriteStream('./spb.png');
				res.body.pipe(dest);
			});
			
		return await message.channel.send({files: ['./spb.png']});
	}
}

module.exports = spbCommand;