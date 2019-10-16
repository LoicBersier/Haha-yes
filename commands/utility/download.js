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
					id: 'alt',
					match: 'flag',
					flag: '--alt'
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
		let needCompress = false;
		let fileName;

		if (args.spoiler) {
			fileName = `SPOILER_${message.author.id}_video`;
		} else {
			fileName = `${message.author.id}_video`;
		}

		if (link.includes('http') || link.includes('www')) {
			let loadingmsg = await message.channel.send('Downloading <a:loadingmin:527579785212329984>');

			if (args.alt) {
				console.log('alt download!');
				if (fs.existsSync(`${os.tmpdir()}/${fileName}.mp4`)) {
					fs.unlink(`${os.tmpdir()}/${fileName}.mp4`, (err) => {
						if (err);
					});
				}
				return youtubedl.exec(args.link, ['-o', `${os.tmpdir()}/${fileName}.mp4`], {}, async function(err, output) {
					if (err) throw err;
					console.log(output.join('\n'));
					message.delete();
					loadingmsg.delete();
					message.channel.send(`Downloaded by ${message.author.username}`, { files: [`${os.tmpdir()}/${fileName}.mp4`] })
						.catch(err => {
							console.error(err);
							loadingmsg.delete();
							return message.channel.send('File too big');	
						});
				});
			}


			let video = youtubedl(link);
			video.pipe(fs.createWriteStream(`${os.tmpdir()}/${fileName}.mp4`));
			video.on('error', async function error(err) {
				console.log('error 2:', err);
				loadingmsg.delete();
				message.channel.send('An error has occured, I can\'t download from the link you provided.');
			});

			video.on('info', async function(info) {
				let duration = info.duration;
				if (duration) {
					duration = duration.replace(/:/g, '');

					if (duration > 500) {
						video.pause();
						video.unpipe();
						loadingmsg.delete();
						return message.channel.send('Can\'t download video longer than 5 minutes');
					}
				}
				
				console.log('Download started');
				console.log('filename: ' + info._filename);
				console.log('size: ' + info.size);


				if (info.size >= 8000000) {
					needCompress = true;
				} 
			});
			video.on('end', async function () {
				if (!needCompress) {
					message.delete();
					loadingmsg.delete();
					return message.channel.send(`Downloaded by ${message.author.username}`, { files: [`${os.tmpdir()}/${fileName}.mp4`] })
						.catch(err => {
							console.error(err);
							loadingmsg.delete();
							return message.channel.send('File too big');		
						});
				}

				let compressmsg = await message.channel.send('Video bigger than 8MB compressing now <a:loadingmin:527579785212329984> (This can take a long time!)\nWant it to go faster? Donate to the dev with the donate command, so i can get a better server and do it faster!');
				loadingmsg.delete();

				const options = {
					input: `${os.tmpdir()}/${fileName}.mp4`,
					output: `${os.tmpdir()}/${fileName}compressed.mp4`,
					preset: 'General/Gmail Small 10 Minutes 288p30'
				};

				//Compress vid if bigger than 8MB
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
			});
		} else {
			return message.channel.send('You need to input a valid link');
		}
	}
}

module.exports = DownloadCommand;