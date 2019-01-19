const { Command } = require('discord-akairo');
const fs = require('fs');
const youtubedl = require('youtube-dl');
const hbjs = require('handbrake-js');
const { fbuser, fbpasswd } = require('../../config.json');

class DownloadCommand extends Command {
	constructor() {
		super('download', {
			aliases: ['download', 'dl'],
			category: 'utility',
			args: [
				{
					id: 'link',
					type: 'string',
					default: 'https://www.youtube.com/watch?v=6n3pFFPSlW4'
				}
			],
			clientPermissions: ['ATTACH_FILES'],
			description: {
				content: 'Download videos from different website from the link you provided',
				usage: '[link]',
				examples: ['https://www.youtube.com/watch?v=6n3pFFPSlW4']
			}
		});
	}

	async exec(message, args) {
		let link = args.link;
		let big = false;

		if (link.includes('http') || link.includes('www')) {
			let video = youtubedl(link, [`--username=${fbuser}`, `--password=${fbpasswd}`]);
			video.pipe(fs.createWriteStream('./video.mp4'));
			video.on('error', function error(err) {
				console.log('error 2:', err);
				message.channel.send('An error has occured, I can\'t download from the link you provided.');
			});
			video.on('info', function(info) {
				console.log('Download started');
				console.log('filename: ' + info.filename);
				console.log('size: ' + info.size);
				if (info.size >= 8000000) {
					big = true;
				} 
			});
			video.on('end', function () {
				if (!big) {
					message.delete();
					return message.channel.send(`Downloaded by ${message.author.username}`, { files: ['./video.mp4'] })
						.catch(() => message.channel.send('File too big'));		
				}
				const options = {
					input: 'video.mp4',
					output: 'videoReady.mp4',
					preset: 'General/Gmail Small 10 Minutes 288p30'
				};
				//Compress vid if bigger than 8MB
				hbjs.spawn(options)
					.on('start', function() {
						message.channel.send('Vid bigger than 8MB compressing now ( This can take a long time!)\nWant it to go faster? Donate to the dev with the donnate command, so i can get a better server and do it faster!');
					})
					.on('error', err => {
						message.channel.send('An error has occured while compressing the video');
						console.error(err);
					})
					.on('progress', progress => {
						console.log(
							'Percent complete: %s, ETA: %s',
							progress.percentComplete,
							progress.eta
						);
					})
					.on('end', function () {
						message.delete();
						message.channel.send(`Downloaded by ${message.author.username}`, { files: ['./videoReady.mp4'] })
							.catch(() => message.channel.send('File too big'));					
					});
				message.channel.send('Downloading <a:loadingmin:527579785212329984>').then(msg => {
					video.on('end', function () {
						msg.delete();
					});
				});
			});
		} else {
			
			message.channel.send('You need to input a valid link');
		}
	}
}

module.exports = DownloadCommand;