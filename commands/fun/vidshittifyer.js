const { Command } = require('discord-akairo');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const youtubedl = require('youtube-dl');
const os = require('os');

class vidshittifyerCommand extends Command {
	constructor() {
		super('vidshittifyer', {
			aliases: ['vidshittifyer', 'vs', 'shittifyer', 'vid2shit', 'v2s'],
			category: 'fun',
			args: [
				{
					id: 'link',
					type: 'string',
				},
				{
					id: 'compresion',
					type: 'string'
				}
			],
			description: {
				content: 'Make your vid shit quality.',
				usage: '[link to video] [compression ( 1, 2 or 3)]',
				examples: ['']
			}
		});
	}

	async exec(message, args) {
		let input = `${os.tmpdir()}/${message.id}.mp4`;
		let output = `${os.tmpdir()}/Shittifyed${message.id}.mp4`;
		let compression;
		if (args.link) {
			if (args.compression == 1) {
				compression = '1m';
			} else if (args.compression == 2) {
				compression = '50k';
			} else {
				compression = '10k';
			}
			let video = youtubedl(args.link);
			video.on('error', function error(err) {
				console.log('error 2:', err);
				message.channel.send('An error has occured, I can\'t download from the link you provided.');
			});
			video.pipe(fs.createWriteStream(input));
			video.on('end', function () {
				exec(`ffmpeg -i ${input} -b:v ${compression}  -b:a ${compression} -vcodec libx264 -r 5 -r 15 ${output}`)
					.then(() => {
						message.delete();
						return message.channel.send({files: [output]})
							.catch(err => {
								console.error(err);
								return message.channel.send('On no! an error just occured! perhaps the file is too big?');
							});
					});
			});
		} else {
			return message.channel.send('You need a valid video link!');
		}
	}
}

module.exports = vidshittifyerCommand;