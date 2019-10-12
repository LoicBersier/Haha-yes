const { Command } = require('discord-akairo');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const youtubedl = require('youtube-dl');
const os = require('os');

class vidshittifierCommand extends Command {
	constructor() {
		super('vidshittifier', {
			aliases: ['vidshittifier', 'vs', 'shittifier', 'vid2shit', 'v2s'],
			category: 'fun',
			args: [
				{
					id: 'link',
					type: 'string',
				},
				{
					id: 'compresion',
					type: 'integer'
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
		if (args.compresion == 1) {
			compression = '50k';
		} else if (args.compresion == 2) {
			compression = '30k';
		} else {
			compression = '10k';
		}
		let option = `-b:v ${compression} -b:a ${compression}`;

		let loadingmsg = await message.channel.send('Processing <a:loadingmin:527579785212329984>');

		if (args.link) {
			return youtubedl.exec(args.link, ['-o', input], {}, function(err) {
				if (err) {
					console.error(err);
					loadingmsg.delete();
					return message.channel.send('An error has occured, I can\'t download from the link you provided.');
				} else {
					shittifie();
				}
			});
		} else {
			return message.channel.send('You need a valid video link!');
		}

		function shittifie() {
			exec(`ffmpeg -i ${input} ${option} -vcodec libx264 -r 15 ${output}`)
				.then(() => {
					loadingmsg.delete();
					message.delete();
					return message.channel.send({files: [output]})
						.catch(err => {
							console.error(err);
							loadingmsg.delete();
							return message.channel.send('On no! an error just occured! perhaps the file is too big?');
						});
				})
				.catch(err => {
					console.error(err);
					loadingmsg.delete();
					return message.channel.send('On no! an error just occured! Im gonna be honest with you, i don\'t know what caused it yet! but worry not! my owner will look into it soon!');
				});
		}
	}
}

module.exports = vidshittifierCommand;