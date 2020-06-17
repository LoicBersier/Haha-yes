const { Command } = require('discord-akairo');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const downloader = require('../../utils/download');
const os = require('os');
const ffmpeg = require('fluent-ffmpeg');


class midifyCommand extends Command {
	constructor() {
		super('midify', {
			aliases: ['midify', 'wav2midi', 'w2m', 'mp32midi', 'm2m', 'sound2midi', 's2m'],
			category: 'fun',
			clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
			args: [
				{
					id: 'link',
					type: 'string',
					match: 'rest'
				},
				{
					id: 'raw',
					match: 'flag',
					flag: ['--raw']
				},
				{
					id: 'noteblock',
					match: 'flag',
					flag: ['--noteblock']
				},
				{
					id: 'voice',
					match: 'flag',
					flag: ['--voice']
				}
			],
			description: {
				content: 'Transform the audio into midi --raw to get the .mid file',
				usage: '[link to video/music/whatever you want to be midi]',
				examples: ['https://www.youtube.com/watch?v=kXYiU_JCYtU']
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

		let input = `${os.tmpdir()}/${message.id}`;
		let input2 = `${os.tmpdir()}/${message.id}.wav`;
		let output = `${os.tmpdir()}/${message.id}.mid`;
		let output2 = `${os.tmpdir()}/${message.id}.mp3`;

		
		let loadingmsg = await message.channel.send('Processing (this can take some time) <a:loadingmin:527579785212329984>');

		if (url) {
			downloader(url, null, input)
				.catch((err) => {
					loadingmsg.delete();
					return message.channel.send(err, { code: true });
				})
				.then(output => {
					// Convert to wav
					ffmpeg()
						.input(output)
						.output(input2)
						.on('end', () => {
							midify();
						})
						.on('error', (err, stdout, stderr) => {
							console.error(`${err}\n${stdout}\n${stderr}`);
							return message.channel.send('Oh no! an error has occured during the conversion, are you sure it is a valid file?');
						})
						.run();
				});
		} else {
			return message.channel.send('You need a valid video link!');
		}

		function midify() {
			// wav to midi
			exec(`waon -i ${input2} -o ${output}`)
				.then(() => {

					if (args.raw) {
						loadingmsg.delete();
						return message.channel.send({files: [output]})
							.catch(err => {
								console.error(err);
								loadingmsg.delete();
								return message.channel.send('On no! an error just occured! perhaps the file is too big?');
							});
					}

					let option;

					if (args.noteblock) {
						option = '-c ./asset/timidity/config/noteblock.cfg';
					} else if (args.voice) {
						option = '-c ./asset/timidity/config/voice.cfg';
					}

					// midi to mp3 so we can listen from discord
					exec(`timidity ${output} ${option} -Ow -o - | ffmpeg -i - -acodec libmp3lame -ab 64k ${output2}`)
						.then(() => {
							loadingmsg.delete();
							return message.channel.send({files: [output2]})
								.catch(err => {
									console.error(err);
									loadingmsg.delete();
									return message.channel.send('On no! an error just occured! perhaps the file is too big?');
								});
						})
						.catch(err => {
							console.error(err);
							return message.channel.send('Oh no! an error has occured during the conversion, are you sure it is a valid file?');
						});
				})
				.catch(err => {
					console.error(err);
					return message.channel.send('Oh no! an error has occured during the conversion, are you sure it is a valid file?');
				});
		}
	}
}

module.exports = midifyCommand;