const { Command } = require('discord-akairo');
const jimp = require('jimp');
const os = require('os');

class gaussianCommand extends Command {
	constructor() {
		super('gaussian', {
			aliases: ['gaussian'],
			category: 'images',
			args: [
				{
					id: 'link',
					type: 'string',
				},
				{
					id: 'radius',
					type: 'integer',
				}
			],
			description: {
				content: 'Make your vid shit quality.',
				usage: '[link to image] [angle of rotation]',
				examples: ['']
			}
		});
	}

	async exec(message, args) {
		let output = `${os.tmpdir()}/gaussian${message.id}.jpg`;

		if (!args.radius) args.radius = 10;


		let Attachment = (message.attachments).array();
		let url = args.link;
		// Get attachment link
		if (Attachment[0] && !args.link) {
			url = Attachment[0].url;
		}

		let loadingmsg = await message.channel.send('Processing <a:loadingmin:527579785212329984>');

		jimp.read({
			url: url
		})
			.then(image => {
				return image
					.gaussian(args.radius)
					.write(output);
			})
			.then(() => {
				loadingmsg.delete();
				return message.channel.send({files: [output]});
			});



	}
}

module.exports = gaussianCommand;