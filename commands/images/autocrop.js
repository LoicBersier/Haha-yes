const { Command } = require('discord-akairo');
const attachment = require('../../utils/attachment');
const jimp = require('jimp');
const os = require('os');

class autocropCommand extends Command {
	constructor() {
		super('autocrop', {
			aliases: ['autocrop', 'crop'],
			category: 'images',
			clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
			args: [
				{
					id: 'link',
					type: 'url',
				}
			],
			description: {
				content: 'autocrop image border of the same color',
				usage: '[link to image]',
				examples: ['']
			}
		});
	}

	async exec(message, args) {
		let output = `${os.tmpdir()}/cropped${message.id}.jpg`;
		let url;

		if (args.link)
			url = args.link.href;
		else
			url = await attachment(message);

		let loadingmsg = await message.channel.send('Processing <a:loadingmin:527579785212329984>');


		jimp.read({
			url: url
		})
			.then(image => {
				return image
					.autocrop()
					.write(output);
			})
			.then(() => {
				loadingmsg.delete();
				return message.channel.send({files: [output]});
			})
			.catch(error => {
				console.error(error);
				return message.channel.send('Oh no, an error just occurred! Maybe the format of your image don\'t work?');
			});




	}
}

module.exports = autocropCommand;