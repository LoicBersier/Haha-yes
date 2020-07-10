const { Command } = require('discord-akairo');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const downloader = require('../../utils/download');
const os = require('os');

class vidshittifierCommand extends Command {
	constructor() {
		super('vidshittifier', {
			aliases: ['vidshittifier', 'vs', 'shittifier', 'vid2shit', 'v2s'],
			category: 'fun',
			clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
			args: [
				{
					id: 'link',
					type: 'string',
				},
				{
					id: 'compression',
					type: 'integer'
				}
			],
			description: {
				content: 'Compress your videos and lower their quality!',
				usage: '[link to video] [compression ( 1, 2 or 3)]',
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

		let input = `${os.tmpdir()}/${message.id}.mp4`;
		let input2 = `${os.tmpdir()}/tmp${message.id}.mp4`;
		let output = `${os.tmpdir()}/Shittified${message.id}.mp4`;

		let compression;
		let audioCompression;

		if (args.compression === 1) {
			compression = '50k';
			audioCompression = '100k';
		} else {
			compression = '30k';
			audioCompression = '60k';
		}
		
		let option = `-b:v ${compression} -b:a ${audioCompression}`;

		let loadingmsg = await message.channel.send('Processing <a:loadingmin:527579785212329984>');

		if (url) {
			downloader(args.link, null, input)
				.on('error', (err) => {
					loadingmsg.delete();
					return message.channel.send(err, { code: true });
				})
				.on('end', () => {
					shittifie();
				});
		} else {
			return message.channel.send('You need a valid video link! Try again!');
		}

		function shittifie() {
			// reduce video resolution
			exec(`ffmpeg -i ${input}  -vf "scale=iw/4:ih/4" ${input2}`)
				.then(() => {
					// upscale video and change bitrate
					exec(`ffmpeg -i ${input2} ${option} -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" -vcodec libx264 -r 15 -f mp4 ${output}`)
						.then(() => {
							loadingmsg.delete();
							message.delete();
							return message.channel.send({files: [output]})
								.catch(err => {
									console.error(err);
									loadingmsg.delete();
									return message.channel.send('On no! an error just occured! Maybe the file is too big?');
								});
						})
						.catch(err => {
							console.error(err);
							loadingmsg.delete();
							return message.channel.send('Oh no! an error just occured! We don\'t know what causes this error yet, so let us know!');
						});
				});
		}
	}
}

module.exports = vidshittifierCommand;