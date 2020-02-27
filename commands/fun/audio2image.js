const { Command } = require('discord-akairo');
const ffmpeg = require('fluent-ffmpeg');
const fetch = require('node-fetch');
const fs = require('fs');
const os = require('os');

class audio2imageCommand extends Command {
	constructor() {
		super('audio2image', {
			aliases: ['audio2image', 'a2i'],
			category: 'fun',
			clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
			args: [
				{
					id: 'link',
					type: 'string',
				},
				{
					id: 'video_size',
					match: 'option',
					flag: '--size',
					default: '640x480'
				}
			],
			description: {
				content: 'Transform audio file into image. --size (a number) to get a bigger image NOTE: bigger image might fail ',
				usage: '[link to audio] [--size anumber]',
				examples: ['https://cdn.discordapp.com/attachments/532987690145021982/682654351772221480/jeff.wav (optional) --size 1920x1080']
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

		if (!url) return message.channel.send('Please attach an audio file or use an url');

		fetch(url)
			.then(res => {
				const dest = fs.createWriteStream(`${os.tmpdir()}/${message.id}`);
				res.body.pipe(dest);
				dest.on('finish', () => {
					ffmpeg(`${os.tmpdir()}/${message.id}`) // Convert to raw pcm
						.audioBitrate(44100)
						.audioChannels(1)
						.format('s16le')
						.audioCodec('pcm_s16le')
						.output(`${os.tmpdir()}/${message.id}1.sw`)
						.on('error', (err, stdout, stderr) => {
							console.error(`${err}\n${stdout}\n${stderr}`);
							return message.channel.send('Uh oh, an error has occured!');
						})						
						.on('end', () => {
							ffmpeg()
								.input(`${os.tmpdir()}/${message.id}1.sw`)
								.inputOption('-pixel_format rgb24')
								.inputOption(`-video_size ${args.video_size}`)
								.inputFormat('rawvideo')
								.frames('1')
								.output(`${os.tmpdir()}/a2i${message.id}.png`)
								.on('error', (err, stdout, stderr) => {
									console.error(`${err}\n${stdout}\n${stderr}`);
									return message.channel.send('Uh oh, an error has occured! The image size is most likely bigger than the content!');
								})	
								.on('end', () => {
									console.log('finished');
									loadingmsg.delete();
									let file = fs.statSync(`${os.tmpdir()}/a2i${message.id}.png`);
									let fileSize = (file.size / 1000000.0).toFixed(2);
									return message.channel.send(`Image is ${fileSize} MB for ${args.video_size} resolution`, {files: [`${os.tmpdir()}/a2i${message.id}.png`]})
										.catch(() => {
											return message.channel.send(`End result is too big to fit on discord! File is ${fileSize} MB`);										});
								})
								.run();
						})
						.run();
				});
			});

	}
}

module.exports = audio2imageCommand;