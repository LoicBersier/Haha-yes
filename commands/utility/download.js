const { Command } = require('discord-akairo');
const fs = require('fs');
const youtubedl = require('youtube-dl');
const hbjs = require('handbrake-js');
const os = require('os');

class DownloadCommand extends Command {
	constructor() {
		super('download', {
			aliases: ['download', 'dl'],
			category: 'utility',
			args: [
				{
					id: 'link',
					type: 'string',
					prompt: {
						start: 'Send the link of wich video you want to download',
					}
				},
				{
					id: 'spoiler',
					match: 'flag',
					flag: ['--spoil', '--spoiler', '-s']
				}
			],
			clientPermissions: ['ATTACH_FILES'],
			description: {
				content: 'Download videos from different website from the link you provided, use "-s" to make the vid a spoiler, use "--alt" to download from website that dosen\'t work otherwise (e.g: twitter)',
				usage: '[link]',
				examples: ['https://www.youtube.com/watch?v=6n3pFFPSlW4']
			}
		});
	}

	async exec(message, args) {
		let link = args.link;
		let fileName;

		if (args.spoiler) {
			fileName = `SPOILER_${message.author.id}_video`;
		} else {
			fileName = `${message.author.id}_video`;
		}

		if (link.includes('http') || link.includes('www')) {
			let loadingmsg = await message.channel.send('Downloading <a:loadingmin:527579785212329984>');

			if (fs.existsSync(`${os.tmpdir()}/${fileName}.mp4`)) {
				fs.unlink(`${os.tmpdir()}/${fileName}.mp4`, (err) => {
					if (err);
				});
			}
			return youtubedl.exec(args.link, ['-o', `${os.tmpdir()}/${fileName}.mp4`], {}, async function(err, output) {
				if (err) {
					console.error(err);
					loadingmsg.delete();
					return message.channel.send('An error has occured, I can\'t download from the link you provided.');
				}
				console.log(output.join('\n'));

				let file = fs.statSync(`${os.tmpdir()}/${fileName}.mp4`);
				let fileSize = file.size / 1000000.0;

				console.log(fileSize);

				//Compress vid if bigger than 8MB
				if (fileSize > 8) {
					console.log('file bigger than 8MB');
					let compressmsg = await message.channel.send('Video bigger than 8MB compressing now <a:loadingmin:527579785212329984> (This can take a long time!)\nWant it to go faster? Donate to the dev with the donate command, so i can get a better server and do it faster!');
					loadingmsg.delete();

					const options = {
						input: `${os.tmpdir()}/${fileName}.mp4`,
						output: `${os.tmpdir()}/${fileName}compressed.mp4`,
						preset: 'General/Gmail Small 10 Minutes 288p30'
					};
	
					let handbrake = hbjs.spawn(options);
					handbrake.on('error', err => {
						console.error(err);
						compressmsg.delete();
						return message.channel.send('An error has occured while compressing the video');
					});
					handbrake.on('progress', progress => {
						console.log(
							'Percent complete: %s, ETA: %s',
							progress.percentComplete,
							progress.eta
						);
					});
					handbrake.on('end', async function () {
						message.delete();
						compressmsg.delete();
						return message.channel.send(`Downloaded by ${message.author.username}`, { files: [`${os.tmpdir()}/${fileName}compressed.mp4`] })
							.catch(err => {
								console.error(err);
								compressmsg.delete();
								return message.channel.send('File too big');		
							});			
					});
				} else {
					console.log('file smaller than 8MB');
					message.delete();
					loadingmsg.delete();
					return message.channel.send(`Downloaded by ${message.author.username}`, { files: [`${os.tmpdir()}/${fileName}.mp4`] })
						.catch(err => {
							console.error(err);
							loadingmsg.delete();
							return message.channel.send('File too big');	
						});
				}
			});
		}
		return message.channel.send('You need to input a valid link');
	}
}

module.exports = DownloadCommand;