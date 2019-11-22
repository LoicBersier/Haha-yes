const { Command } = require('discord-akairo');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const youtubedl = require('youtube-dl');
const os = require('os');

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
				}
			],
			description: {
				content: 'Transform the audio into midi',
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

		let input = `${os.tmpdir()}/${message.id}.mp4`;
		let input2 = `${os.tmpdir()}/${message.id}.wav`;
		let output = `${os.tmpdir()}/${message.id}.mid`;
		let output2 = `${os.tmpdir()}/${message.id}.mp3`;

		
		let loadingmsg = await message.channel.send('Processing (this can take some time) <a:loadingmin:527579785212329984>');

		if (url) {
			return youtubedl.exec(url, ['--format=mp4', '-o', input], {}, function(err) {
				if (err) {
					console.error(err);
					loadingmsg.delete();
					return message.channel.send('An error has occured, I can\'t download from the link you provided.');
				} else {
					// Convert to wav
					exec(`ffmpeg -i ${input} ${input2}`)
						.then(() => {
							midify();
						})
						.catch(err => {
							console.error(err);
							return message.channel.send('Oh no! an error has occured during the conversion, are you sure it is a valid file?');
						});
				}
			});
		} else {
			return message.channel.send('You need a valid video link!');
		}

		function midify() {
			// wav to midi
			exec(`waon -i ${input2} -o ${output}`)
				.then(() => {
					// midi to mp3 so we can listen from discord
					exec(`timidity ${output} -Ow -o - | ffmpeg -i - -acodec libmp3lame -ab 64k ${output2}`)
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