const { Command } = require('discord-akairo');
let gm = require('gm');
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
					type: 'string',
				},
				{
					id: 'message',
					type: 'string',
					match: 'rest'
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
		let output = `${os.tmpdir()}/meme${message.id}.jpg`;

		let options = args.message.trim().split('|');

		if (options[0] == undefined)
			options[0] = '';
		else if (options[1] == undefined)
			options[1] = '';

		let Attachment = (message.attachments).array();
		let url = args.link;
		// Get attachment link
		if (Attachment[0] && !args.link) {
			url = Attachment[0].url;
		}

		if (!url) {
			return message.channel.send('You need an image to use this command!');
		}

		let loadingmsg = await message.channel.send('Processing <a:loadingmin:527579785212329984>');

		// Create new graphicsmagick instance
		fetch(url)
			.then(res => {
				const dest = fs.createWriteStream(`${os.tmpdir()}/${message.id}.jpg`);
				res.body.pipe(dest);
				dest.on('finish', async () => {

					let img = gm(`${os.tmpdir()}/${message.id}.jpg`);

					// Set some defaults
					const TOP_TEXT = options[0];
					const BOTTOM_TEXT = options[1];
					const FONT = './asset/impact.ttf';
					const FONT_SIZE = 40;
					const FONT_FILL = '#FFF';
					const TEXT_POS = 'center';
					const STROKE_COLOR = '#000';
					const STROKE_WEIGHT = 2;
					const PADDING = 40;
			
					// Get the image size to calculate top and bottom text positions
					img.size(function(err, value) {
						console.log(value);
						// Set text position for top and bottom
						const TOP_POS = Math.abs((value.height / 2) - PADDING) * -1;
						const BOTTOM_POS = (value.height / 2) - PADDING;
			
						// Write text on image using graphicsmagick
						img.font(FONT, FONT_SIZE)
							.fill(FONT_FILL)
							.stroke(STROKE_COLOR, STROKE_WEIGHT)
							.drawText(0, TOP_POS, TOP_TEXT, TEXT_POS)
							.drawText(0, BOTTOM_POS, BOTTOM_TEXT, TEXT_POS)
							.write(output, function(err) {
								loadingmsg.delete();
								if (err) return message.channel.send('An error just occured! is it a static image?');
								return message.channel.send({files: [output]});
							});
					});
				});
			});




	}
}

module.exports = memeCommand;