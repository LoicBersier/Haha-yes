const { Command } = require('discord-akairo');
const fs = require('fs');
const os = require('os');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const superagent = require('superagent');

class vid2giftCommand extends Command {
	constructor() {
		super('vid2gift', {
			aliases: ['vid2gif', 'v2g'],
			category: 'utility',
			args: [
				{
					id: 'vid',
					type: 'string'
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
		let vid = args.vid;

		if (!vid) {
			return message.channel.send('I need a video to do that!');
		} else if (vid) {

			const { body: buffer } = await superagent.get(vid).catch(() => {
				return message.channel.send('An error as occured, please try again');
			});
			let options = '';

			if (args.scale) {
				options = '-vf "scale=iw/2:ih/2"';
			}

			if (args.fps) {
				options += ` -r ${args.fps}`;
			}




			fs.writeFile(`${os.tmpdir()}/${message.id}v2g`, buffer, () => {
				exec(`ffmpeg -i ${os.tmpdir()}/${message.id}v2g ${options} -r 15 ${os.tmpdir()}/${message.id}v2g.gif -hide_banner`)
					.then(() => {
						return message.channel.send({files: [`${os.tmpdir()}/${message.id}v2g.gif`]})
							.catch(err => {
								console.error(err);
								return message.channel.send('Could not send the file! Perhaps the file is too big?');
							});
					})
					.catch(err => {
						console.error(err);
						return message.channel.send('There was an error during conversion! maybe try with another file type?');
					});
			});

		}

	}
}

module.exports = vid2giftCommand;