const { Command } = require('discord-akairo');
const ffmpeg = require('fluent-ffmpeg');
const fetch = require('node-fetch');
const fs = require('fs');
const os = require('os');

class image2audioCommand extends Command {
	constructor() {
		super('image2audio', {
			aliases: ['image2audio', 'i2a'],
			category: 'fun',
			clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
			args: [
				{
					id: 'link',
					type: 'string',
				}
			],
			description: {
				content: 'Transform an image binary data into audio ( MIGHT BECOME EAR RAPE )',
				usage: '[link to image]',
				examples: ['']
			}
		});
	}

	async exec(message, args) {
		let Attachment = (message.attachments).array();
		let url = args.link;
		// Get attachment link
		if (Attachment[0] && !args.link) {
			url = Attachment[0].url;
		}

		let loadingmsg = await message.channel.send('Processing <a:loadingmin:527579785212329984>');

		if (!url) return message.channel.send('Please attach an image or use an url');

		fetch(url)
			.then(res => {
				const dest = fs.createWriteStream(`${os.tmpdir()}/${message.id}.png`);
				res.body.pipe(dest);
				dest.on('finish', () => {
					ffmpeg(`${os.tmpdir()}/${message.id}.png`)
						.format('rawvideo')
						.output(`${os.tmpdir()}/${message.id}1.png`)
						.on('error', (err, stdout, stderr) => console.error(`${err}\n${stdout}\n${stderr}`))
						.on('end', () => {
							ffmpeg()
								.audioBitrate(44100)
								.audioChannels(1)
								.input(`${os.tmpdir()}/${message.id}1.png`)
								.inputFormat('s16le')
								.output(`${os.tmpdir()}/i2a_${message.id}.wav`)
								.on('error', (err, stdout, stderr) => console.error(`${err}\n${stdout}\n${stderr}`))
								.on('end', () => {
									console.log('finished');
									loadingmsg.delete();
									return message.channel.send({files: [`${os.tmpdir()}/i2a_${message.id}.wav`]});
								})
								.run();
						})
						.run();
				});
			});

	}
}

module.exports = image2audioCommand;