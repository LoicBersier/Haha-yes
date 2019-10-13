const { Command } = require('discord-akairo');
const jimp = require('jimp');
const os = require('os');

class mirrorCommand extends Command {
	constructor() {
		super('mirror', {
			aliases: ['mirror', 'flip'],
			category: 'images',
			args: [
				{
					id: 'link',
					type: 'string',
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


		let Attachment = (message.attachments).array();
		let url = args.link;
		// Get attachment link
		if (Attachment[0] && !args.link) {
			url = Attachment[0].url;
		}


		jimp.read({
			url: url
		})
			.then(image => {
				return image
					.mirror(true, false)
					.write(output);
			})
			.then(() => {
				return message.channel.send({files: [output]});
			});


	}
}

module.exports = mirrorCommand;