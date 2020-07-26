const { Command } = require('discord-akairo');
const os = require('os');
const ffmpeg = require('fluent-ffmpeg');
const attachment = require('../../utils/attachment');
const downloader = require('../../utils/download');

class vid2gifCommand extends Command {
	constructor() {
		super('vid2gif', {
			aliases: ['vid2gif', 'v2g', 'vg'],
			category: 'utility',
			clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
			args: [
				{
					id: 'vid',
					type: 'url'
				},
				{
					id: 'fps',
					type: 'integer'
				},
				{
					id: 'scale',
					match: 'flag',
					flag: '--scale'
				}
			],
			description: {
				content: 'Transform video into gif. --scale to scale the gif by half,',
				usage: '[link to video] [Number of fps]',
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

		let loadingmsg = await message.channel.send('Processing <a:loadingmin:527579785212329984>');


		downloader(vid, null, `${os.tmpdir()}/${message.id}v2g`)
			.on('error', async err => {
				return message.channel.send(err, { code: true });
			})
			.on('end', async output => {
				let ffmpegCommand = ffmpeg(output);

				if (args.scale) ffmpegCommand.videoFilters('scale=iw/2:ih/2');
				ffmpegCommand.fps(args.fps ? args.fps : 15);
				ffmpegCommand.output(`${os.tmpdir()}/${message.id}v2g.gif`);
				ffmpegCommand.run();
				ffmpegCommand.on('error', (err, stdout, stderr) => {
					loadingmsg.delete();
					console.error(`${err}\n${stdout}\n${stderr}`);
					return message.channel.send('Uh oh, an error has occurred!' + err);
				});
				ffmpegCommand.on('end', () => {
					loadingmsg.delete();
					message.delete();
					return message.channel.send({files: [`${os.tmpdir()}/${message.id}v2g.gif`]})
						.catch(err => {
							console.error(err);
							return message.channel.send(`${err.name}: ${err.message} ${err.message === 'Request entity too large' ? 'The file size is too big' : ''}`);
						});
				});
			});
	}
}

module.exports = vid2gifCommand;