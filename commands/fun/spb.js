const { Command } = require('discord-akairo');
const fs = require('fs');
const fetch = require('node-fetch');
const os = require('os');

class spbCommand extends Command {
	constructor() {
		super('spb', {
			aliases: ['spb'],
			category: 'fun',
			clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
			args: [
				{
					id: 'link',
					type: 'url',
					prompt: {
						start: 'Need a shitpostbot5000 template link!',
					}
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
		if (!args.link || !args.link.href.includes('shitpostbot.com/template/')) {
			return message.reply('Need a Shitpostbot 5000 template link!\nYou can find them here! <https://www.shitpostbot.com/gallery/templates>');
		}

		let link = args.link.href.replace('template', 'preview');

		fetch(link)
			.then(res => {
				const dest = fs.createWriteStream(`${os.tmpdir()}/${message.id}.jpg`);
				res.body.pipe(dest);
				dest.on('finish', () => {
					return message.reply({files: [`${os.tmpdir()}/${message.id}.jpg`]});
				});
			});
	}
}

module.exports = spbCommand;