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
				examples: ['https://cdn.discordapp.com/attachments/532987690145021982/682694359313022987/a2i682694012309864452.png']
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
						.on('error', (err, stdout, stderr) => {
							console.error(`${err}\n${stdout}\n${stderr}`);
							return message.channel.send('Uh oh, an error has occured!');
						})							
						.on('end', () => {
							ffmpeg()
								.audioBitrate(44100)
								.audioChannels(1)
								.input(`${os.tmpdir()}/${message.id}1.png`)
								.inputFormat('s16le')
								.output(`${os.tmpdir()}/i2a_${message.id}.mp3`)
								.on('error', (err, stdout, stderr) => {
									console.error(`${err}\n${stdout}\n${stderr}`);
									return message.channel.send('Uh oh, an error has occured!');
								})									
								.on('end', () => {
									console.log('finished');
									loadingmsg.delete();
									let file = fs.statSync(`${os.tmpdir()}/i2a_${message.id}.mp3`);
									let fileSize = (file.size / 1000000.0).toFixed(2);
									return message.channel.send(`Audio file is ${fileSize} MB`, {files: [`${os.tmpdir()}/i2a_${message.id}.mp3`]})
										.catch(() => {
											return message.channel.send(`End result is too big to fit on discord! File is ${fileSize} MB`);
										});
								})
								.run();
						})
						.run();
				});
			});

	}
}

module.exports = image2audioCommand;