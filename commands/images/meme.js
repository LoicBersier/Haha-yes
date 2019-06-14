const { Command } = require('discord-akairo');
const gm = require('gm');
const fetch = require('node-fetch');
const fs = require('fs');   

class memeCommand extends Command {
	constructor() {
		super('meme', {
			aliases: ['meme', 'caption'],
			category: 'general',
			args: [
				{
					id: 'topText',
					type: 'string',
				},
				{
					id: 'bottomText',
					type: 'string',
				},
				{
					id: 'ImageURL',
					type: 'string',
				}
			],
			description: {
				content: 'Put Impact font on your image (Use quotes for multiples words, it also support gif)',
				usage: '[topText] [bottom text] [GIF url (or as attachment)]',
				examples: ['"hahah look at this" "funny doge" https://cdn.discordapp.com/attachments/586308815868395535/588472173824311306/resize.gif']
			}
		});
	}

	async exec(message, args) {
		let Attachment = (message.attachments).array();
		if (args.ImageURL) {
			fetch(args.ImageURL)
				.then(res => {
					const dest = fs.createWriteStream('./img/memeInput.gif');
					res.body.pipe(dest);
					dest.on('finish', () => {
						processGif();
					});
				});
		} else if (Attachment[0]) {
			fs.writeFile('./img/memeInput.gif', Attachment[0], 'binary', function(err) {
				if (err) throw err;
				processGif();
			});
		} else {
			return message.channel.send('Please use an image!');
		}

		function processGif() {
			gm('./img/memeInput.gif')
				.stroke('#000000', 0.1)
				.fill('#ffffff')
				/*
				// I have to try to make this work so font can adapt with image
				.size(function(err, size) {
					if (err) throw err;
					if (size.width < 300 ) {
						console.log('ye');
						this.pointSize(10);
					} else {
						console.log('nah');
						this.pointSize(50);
					}
				})
				*/
				.font('/usr/share/fonts/TTF/impact.ttf', 40)
				.drawText(0, 30, args.topText, 'North')
				.drawText(0, 10, args.bottomText, 'South')
				.write('./img/meme.gif', function (err) {
					if (!err) {
						message.channel.send({files: ['./img/meme.gif']});
					} else {
						console.error(err);
					}
				});
		}
	}
}

module.exports = memeCommand;