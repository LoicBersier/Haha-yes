const { Command } = require('discord-akairo');
const { removebgAPI } = require('../../config.json');
const removd = require('removd');
const os = require('os');

class removebgCommand extends Command {
	constructor() {
		super('removebg', {
			aliases: ['removebg'],
			category: 'utility',
			args: [
				{
					id: 'image',
					type: 'string'
				}
			],
			description: {
				content: 'Remove the background from the image you send using remove.bg',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message, args) {
		let Attachment = (message.attachments).array();
		let url = args.image;
		if (Attachment[0] && !args.image) {
			url = Attachment[0].url;
		}
		const outputFile = `${os.tmpdir()}/rempvebg.png`;
		const done = await removd.url({
			apikey: removebgAPI,
			destination: outputFile,
			source: url
		});
		if (done && !done.error) {
			return message.channel.send({files: [outputFile]});
		} else {
			console.error(done);
			return message.channel.send('Oh no! an error just occured!');
		}
	}
}

module.exports = removebgCommand;