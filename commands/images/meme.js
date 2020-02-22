const { Command } = require('discord-akairo');
const gm = require('gm').subClass({imageMagick: true});
const os = require('os');
const fetch = require('node-fetch');
const fs = require('fs');

class memeCommand extends Command {
	constructor() {
		super('meme', {
			aliases: ['meme', 'impact'],
			category: 'images',
			clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
			args: [
				{
					id: 'link',
					prompt: {
						start: 'Please input a link to use, say `cancel` to stop the command'
					},
					type: 'string',
				},
				{
					id: 'message',
					prompt: {
						start: 'Please input a caption, say `cancel` to stop the command'
					},
					type: 'string',
					match: 'rest'
				},
				{
					id: 'fontSize',
					match: 'option',
					flag: '--fontSize',
				}
			],
			description: {
				content: 'Impact font on image (use ``|`` to separate top text and bottom text)',
				usage: '[link to image] [topText|bottomText]',
				examples: ['']
			}
		});
	}

	async exec(message, args) {
		let options = args.message.trim().split('|');

		if (options[0] == undefined)
			options[0] = '';
		else if (options[1] == undefined)
			options[1] = '';

		let url = args.link;


		if (!url) {
			return message.channel.send('You need an image to use this command!');
		}

		let loadingmsg = await message.channel.send('Processing <a:loadingmin:527579785212329984>');

		// Create new graphicsmagick instance
		fetch(url)
			.then(res => {
				const dest = fs.createWriteStream(`${os.tmpdir()}/${message.id}`);
				res.body.pipe(dest);
				dest.on('finish', async () => {

					let img = gm(`${os.tmpdir()}/${message.id}`);

					// Set some defaults
					const TOP_TEXT = options[0];
					const BOTTOM_TEXT = options[1];
					const FONT = './asset/impact.ttf';
					const FONT_FILL = '#FFF';
					const TEXT_POS = 'center';
					const STROKE_COLOR = '#000';
					const PADDING = 40;
			
					img.format(function(err, format) {
						if (err) {
							console.error(err);
							return message.channel.send('An error has occured, is it an image?');
						}
						let output = `${os.tmpdir()}/meme${message.id}.${format.toLowerCase()}`;

						if (format.toLowerCase() == 'gif') img.coalesce();

						// Get the image size to calculate top and bottom text positions
						img.size(function(err, value) {
							// Set text position for top and bottom
							const TOP_POS = Math.abs((value.height / 2) - PADDING) * -0.9;
							const BOTTOM_POS = ((value.height / 2) - PADDING * 3);
							let FONT_SIZE = args.fontSize ? args.fontSize : (value.width / 10);
				
							// Write text on image using graphicsmagick
							img.font(FONT, FONT_SIZE)
								.fill(FONT_FILL)
								.stroke(STROKE_COLOR)
								.drawText(0, TOP_POS, TOP_TEXT, TEXT_POS)
								.drawText(0, BOTTOM_POS, BOTTOM_TEXT, TEXT_POS)
								.write(output, function(err) {
									loadingmsg.delete();
									if (err) return message.channel.send('An error just occured! is it a static image?');
									message.delete();
									return message.channel.send(`Made by ${message.author.username}`,{files: [output]})
										.catch(() => {
											return message.channel.send('The image is too big to fit on discord!');
										});
								});
						});
					});

				});
			})
			.catch((err) => {
				return message.channel.send(`Please input a correct link \`${err}\``);
			});
	}
}

module.exports = memeCommand;