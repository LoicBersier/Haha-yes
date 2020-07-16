const { Command } = require('discord-akairo');
const attachment = require('../../utils/attachment');
const jimp = require('jimp');
const os = require('os');

class jpegifyCommand extends Command {
	constructor() {
		super('jpegify', {
			aliases: ['jpegify'],
			category: 'images',
			clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
			args: [
				{
					id: 'link',
					type: 'url',
				}
			],
			description: {
				content: 'jpegify your image',
				usage: '[link to image]',
				examples: ['']
			}
		});
	}

	async exec(message, args) {
		let output = `${os.tmpdir()}/jpegified${message.id}.jpg`;
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
					.quality(1)
					.write(output);
			})
			.then(() => {
				loadingmsg.delete();
				return message.channel.send({files: [output]});
			})
			.catch(error => {
				console.error(error);
				return message.channel.send('Oh no, an error just occured! Maybe the format of your image don\'t work?');
			});



	}
}

module.exports = jpegifyCommand;