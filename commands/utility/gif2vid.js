const { Command } = require('discord-akairo');
const os = require('os');
const ffmpeg = require('fluent-ffmpeg');
const attachment = require('../../utils/attachment');
const downloader = require('../../utils/download');

class gif2vidCommand extends Command {
	constructor() {
		super('gif2vid', {
			aliases: ['gif2vid', 'g2v', 'gv'],
			category: 'utility',
			clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
			args: [
				{
					id: 'vid',
					type: 'string'
				}
			],
			description: {
				content: 'Transform gif into video.',
				usage: '[link to gif]',
				examples: ['']
			}
		});
	}

	async exec(message, args) {
		let vid;

		if (args.vid)
			vid = args.vid.href;
		else
			vid = await attachment(message);

		if (!vid.endsWith('gif')) return message.channel.send('Please use a gif.');

		let loadingmsg = await message.channel.send('Processing <a:loadingmin:527579785212329984>');

		downloader(vid, null, `${os.tmpdir()}/${message.id}g2v`)
			.on('error', async err => {
				loadingmsg.delete();
				return message.channel.send(err, { code: true });
			})
			.on('end', async output => {
				let ffmpegCommand = ffmpeg(output);

				ffmpegCommand.videoFilters('scale=trunc(iw/2)*2:trunc(ih/2)*2');
				ffmpegCommand.fps(args.fps ? args.fps : 15);
				ffmpegCommand.output(`${os.tmpdir()}/${message.id}g2v.mp4`);
				ffmpegCommand.outputOptions('-pix_fmt yuv420p');
				ffmpegCommand.run();
				ffmpegCommand.on('error', (err, stdout, stderr) => {
					loadingmsg.delete();
					console.error(`${err}\n${stdout}\n${stderr}`);
					return message.channel.send('Uh oh, an error has occurred!' + err);
				});
				ffmpegCommand.on('end', () => {
					loadingmsg.delete();
					message.delete();
					return message.channel.send({files: [`${os.tmpdir()}/${message.id}g2v.mp4`]})
						.catch(err => {
							console.error(err);
							return message.channel.send(`${err.name}: ${err.message} ${err.message === 'Request entity too large' ? 'The file size is too big' : ''}`);
						});
				});
			});
	}
}

module.exports = gif2vidCommand;