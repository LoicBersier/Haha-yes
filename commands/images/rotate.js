const { Command } = require('discord-akairo');
const attachment = require('../../utils/attachment');
const jimp = require('jimp');
const os = require('os');

class rotateCommand extends Command {
	constructor() {
		super('rotate', {
			aliases: ['rotate'],
			category: 'images',
			clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
			args: [
				{
					id: 'link',
					type: 'url',
					unordered: true
				},
				{
					id: 'rotate',
					type: 'integer',
					prompt: {
						start: 'Please enter the number of degrees you want to rotate.',
						retry: 'This doesn\'t look like a number to me, please try again.'
					},
					unordered: true
				}
			],
			description: {
				content: 'Rotate your image',
				usage: '[link to image] [angle of rotation]',
				examples: ['']
			}
		});
	}

	async exec(message, args) {
		let output = `${os.tmpdir()}/rotated${message.id}.jpg`;


		let url;
		if (args.link)
			url = args.link.href;
		else
			url = await attachment(message);


		if (!url) {
			return message.channel.send('You need an image to use this command!');
		}

		let loadingmsg = await message.channel.send('Processing <a:loadingmin:527579785212329984>');

		jimp.read({
			url: url
		})
			.then(image => {
				return image
					.rotate(args.rotate)
					.write(output);
			})
			.then(() => {
				loadingmsg.delete();
				return message.channel.send({files: [output]});
			})
			.catch(error => {
				console.error(error);
				return message.channel.send('Oh no, an error just vidshittyfiered! Maybe the format of your image don\'t work?');
			});




	}
}

module.exports = rotateCommand;