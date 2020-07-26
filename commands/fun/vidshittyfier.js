const { Command } = require('discord-akairo');
const os = require('os');
const ffmpeg = require('fluent-ffmpeg');
const attachment = require('../../utils/attachment');
const downloader = require('../../utils/download');

class vidshittyfierCommand extends Command {
	constructor() {
		super('vidshittyfier', {
			aliases: ['vidshittyfier', 'vs', 'shittyfier', 'vid2shit', 'v2s'],
			category: 'fun',
			clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
			args: [
				{
					id: 'link',
					type: 'url',
					unordered: true
				},
				{
					id: 'compression',
					type: 'boolean',
					default: false,
					unordered: true
				}
			],
			description: {
				content: 'Compress your videos and lower their quality!',
				usage: '[link to video] [lighter compression (True or false)]',
				examples: ['']
			}
		});
	}

	async exec(message, args) {
		let vid;
		if (args.link)
			vid = args.link.href;
		else
			vid = await attachment(message);

		let output = `${os.tmpdir()}/tmp${message.id}.mp4`;
		let output2 = `${os.tmpdir()}/Shittyfied${message.id}.mp4`;

		let compression = '30k';
		let audioCompression = '60k';

		if (args.compression) {
			compression = '50k';
			audioCompression = '100k';
		}

		let loadingmsg = await message.channel.send('Processing <a:loadingmin:527579785212329984>');

		downloader(vid, null, `${os.tmpdir()}/${message.id}.mp4`)
			.on('error', async err => {
				loadingmsg.delete();
				return message.channel.send(err, { code: true });
			})
			.on('end', async downloadOutput => {
				let ffmpegCommand = ffmpeg(downloadOutput);

				ffmpegCommand.videoFilters('scale=iw/4:ih/4');
				ffmpegCommand.output(output);
				ffmpegCommand.run();
				ffmpegCommand.on('error', (err, stdout, stderr) => {
					loadingmsg.delete();
					console.error(`${err}\n${stdout}\n${stderr}`);
					return message.channel.send('Uh oh, an error has occurred!' + err);
				});
				ffmpegCommand.on('end', () => {
					let ffmpegCommand = ffmpeg(downloadOutput);

					ffmpegCommand.videoFilters('scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2');
					ffmpegCommand.videoCodec('libx264');
					ffmpegCommand.fps(15);
					ffmpegCommand.videoBitrate(compression);
					ffmpegCommand.audioBitrate(audioCompression);
					ffmpegCommand.output(output2);
					ffmpegCommand.run();
					ffmpegCommand.on('error', (err, stdout, stderr) => {
						loadingmsg.delete();
						console.error(`${err}\n${stdout}\n${stderr}`);
						return message.channel.send('Uh oh, an error has occurred!' + err);
					});
					ffmpegCommand.on('end', () => {
						loadingmsg.delete();
						message.delete();
						return message.channel.send({files: [output2]})
							.catch(err => {
								console.error(err);
								return message.channel.send(`${err.name}: ${err.message} ${err.message === 'Request entity too large' ? 'The file size is too big' : ''}`);
							});
					});
				});
			});
	}
}

module.exports = vidshittyfierCommand;