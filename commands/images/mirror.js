const { Command } = require('discord-akairo');
const attachment = require('../../utils/attachment');
const jimp = require('jimp');
const os = require('os');

class mirrorCommand extends Command {
	constructor() {
		super('mirror', {
			aliases: ['mirror', 'flip'],
			category: 'images',
			clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
			args: [
				{
					id: 'link',
					type: 'url',
				}
			],
			description: {
				content: 'mirror the image.',
				usage: '[link to image]',
				examples: ['']
			}
		});
	}

	async exec(message, args) {
		let output = `${os.tmpdir()}/mirrored${message.id}.jpg`;
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
					.mirror(true, false)
					.write(output);
			})
			.then(() => {
				loadingmsg.delete();
				return message.channel.send({files: [output]});
			})
			.catch(error => {
				console.error(error);
				return message.channel.send('Oh no, an error just occurredred! Maybe the format of your image don\'t work?');
			});


	}
}

module.exports = mirrorCommand;