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
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES'],
			args: [
				{
					id: 'link',
					type: 'string',
					prompt: {
						start: 'Send the link of which video you want to download',
					}
				},
				{
					id: 'caption',
					type: 'string',
					match: 'rest'
				},
				{
					id: 'spoiler',
					match: 'flag',
					flag: ['--spoil', '--spoiler', '-s']
				}
			],
			description: {
				content: 'Download videos from different website from the link you provided, use "-s" to make the vid a spoiler',
				usage: '[link] [caption]',
				examples: ['https://www.youtube.com/watch?v=6n3pFFPSlW4 Look at this funny gnome']
			}
		});
	}

	async exec(message, args) {
		if (args.caption == null) args.caption = '';
		
		let link = args.link;
		let fileName;

		if (args.spoiler) {
			fileName = `SPOILER_${message.author.id}_video`;
		} else {
			fileName = `${message.author.id}_video`;
		}


		const Embed = this.client.util.embed()
			.setColor(message.member.displayHexColor)
			.setAuthor(`Downloaded by ${message.author.username}`, message.author.displayAvatarURL(), link)
			.setDescription(args.caption)
			.setFooter('You can get the original video by clicking on the "downloaded by" message!');


		if (link.includes('http') || link.includes('www')) {
			let loadingmsg = await message.channel.send('Downloading <a:loadingmin:527579785212329984>');

			if (fs.existsSync(`${os.tmpdir()}/${fileName}.mp4`)) {
				fs.unlink(`${os.tmpdir()}/${fileName}.mp4`, (err) => {
					if (err);
				});
			}
			return youtubedl.exec(link, ['--format=mp4', '-o', `${os.tmpdir()}/${fileName}.mp4`], {}, async function(err) {
				if (err) {
					console.error(err);
					loadingmsg.delete();
					return message.channel.send('An error has occured, I can\'t download from the link you provided.');
				}

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


					let percentComplete;
					let eta;

					handbrake.on('progress', progress => {
						percentComplete = progress.percentComplete;
						eta = progress.eta;
						console.log(`Percent complete: ${progress.percentComplete}, ETA: ${progress.eta}`);
					});

					// Every 5 seconds update the compress message with the %
					setInterval(() => {
						compressmsg.edit(`Compression status: Percent complete: ${percentComplete}, ETA: ${eta}\nWant it to go faster? Donate to the dev with the donate command, so i can get a better server and do it faster!`);
					}, 5000);

					handbrake.on('end', async function () {
						file = fs.statSync(`${os.tmpdir()}/${fileName}compressed.mp4`);
						fileSize = file.size / 1000000.0;

						message.delete();
						compressmsg.delete();

						if (fileSize > 8) {
							return message.channel.send('File too big!');
						}

						return message.channel.send({embed: Embed, files: [`${os.tmpdir()}/${fileName}compressed.mp4`]})
							.catch(err => {
								console.error(err);
								compressmsg.delete();
								loadingmsg.delete();
								return message.channel.send('File too big');		
							});			
					});
				} else {
					loadingmsg.delete();
					message.delete();

					return message.channel.send({embed: Embed, files: [`${os.tmpdir()}/${fileName}.mp4`]})
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