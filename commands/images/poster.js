const { Command } = require('discord-akairo');
let gm = require('gm');
const os = require('os');
const fetch = require('node-fetch');
const fs = require('fs');

class posterCommand extends Command {
	constructor() {
		super('poster', {
			aliases: ['poster'],
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
					id: 'width',
					match: 'option',
					flag: '--width',
					default: 50
				},
				{
					id: 'height',
					match: 'option',
					flag: '--height',
					default: 200
				},
				{
					id: 'title',
					match: 'option',
					flag: '--titleSize',
				},
				{
					id: 'subtext',
					match: 'option',
					flag: '--subtextSize',
				},
			],
			description: {
				content: 'Create demotivational poster (use ``|`` to separate top text and bottom text) WIP',
				usage: '[link to image] [topText|bottomText] (optional) [--width number] [--height number]',
				examples: ['https://cdn.discordapp.com/attachments/484013245158522909/679686216903426104/0nhsxje5vfg41-1.jpg NO PLEASE DON\'T | My mom said im not allowed to']
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
					const FONT = './asset/times.ttf';
					const FONT_FILL = '#FFF';
					const TEXT_POS = 'center';
					const STROKE_COLOR = '#000';
					const PADDING = 40;

					img.format(function(err, format) {
						if (err) {
							return message.channel.send('An error has occured, is it an image?');
						}
						let output = `${os.tmpdir()}/poster${message.id}.${format.toLocaleLowerCase()}`;
						// Get the image size to calculate top and bottom text positions
						img.size(function(err, value) {
							// Set text position for top and bottom
							const TOP_POS = Math.abs((value.height / 2) - PADDING + 110);
							const BOTTOM_POS = Math.abs((value.height / 2) - PADDING + 180);
							
							let FONT_SIZE1 = args.title ? args.title : (value.width / 12);
							let FONT_SIZE2 = args.subtext ? args.subtext : (value.width / 12) - 15;

							let BORDER_WIDTH = args.width;
							let BORDER_HEIGHT = args.height;

				
							// Write text on image using graphicsmagick
							img.borderColor('black')
								.border(3,3)
								.borderColor('white')
								.frame(1,1,0,0.5)
								.border(1,1)
								.borderColor('black')
								.border(BORDER_WIDTH,BORDER_HEIGHT)
								.fill(FONT_FILL)
								.stroke(STROKE_COLOR, -2)
								.font(FONT, FONT_SIZE1)
								.drawText(0, TOP_POS, TOP_TEXT, TEXT_POS)
								.font(FONT, FONT_SIZE2)
								.drawText(0, BOTTOM_POS, BOTTOM_TEXT, TEXT_POS)
								.write(output, function(err) {
									// Chop the top part of the image
									let img2 = gm(output);
									img2.chop(0, BORDER_HEIGHT / 2)
										.write(output, function(err) {
											loadingmsg.delete();
											if (err) {
												console.error(err);
												return message.channel.send('An error just occured! is it a static image?');
											}
											message.delete();
											return message.channel.send(`Made by ${message.author.username}`,{files: [output]})
												.catch(() => {
													return message.channel.send('The image is too big to fit on discord!');
												});
										});
	
									if (err) {
										console.error(err);
										return message.channel.send('An error just occured! is it a static image?');
									}
								});
						});
					});
			
				});
			})
			.catch((err) => {
				console.error(err);
				return message.channel.send(`Please input a correct link \`${err}\``);
			});
	}
}

module.exports = posterCommand;