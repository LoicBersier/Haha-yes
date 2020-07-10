const { Command } = require('discord-akairo');
const downloader = require('../../utils/download');
const compress = require('../../utils/compress');
const os = require('os');
const fs = require('fs');


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
		let loadingmsg = await message.channel.send('Downloading <a:loadingmin:527579785212329984>');
		let filename = `${message.id}_video`;

		if (args.spoiler) {
			filename = `SPOILER_${message.id}_video`;
		}

		const Embed = this.client.util.embed()
			.setColor(message.member ? message.member.displayHexColor : 'NAVY')
			.setAuthor(`Downloaded by ${message.author.username}`, message.author.displayAvatarURL(), args.link)
			.setDescription(args.caption ? args.caption : '')
			.setFooter(`You can get the original video by clicking on the "downloaded by ${message.author.username}" message!`);




		downloader(args.link, null, `${os.tmpdir()}/${filename}.mp4`)
			.on('error	', async err => {
				return message.channel.send(err, { code: true });
			})
			.on('end', async output => {
				loadingmsg.delete();
				let file = fs.statSync(output);
				let fileSize = file.size / 1000000.0;

				if (fileSize > 8) {
					let compressEmbed = this.client.util.embed()
						.setColor(message.member ? message.member.displayHexColor : 'NAVY')
						.setTitle('This one will need compression!')
						.setDescription('Starting compression now!')
						.setFooter('Want it to go faster? Donate to the dev with the donate command, so i can get a better server and do it faster!');

					let compressmsg = await message.channel.send(compressEmbed);

					let handbrake = compress(output, `${os.tmpdir()}/${filename}compressed.mp4`);

					let percentComplete;
					let eta;

					handbrake.on('progress', progress => {
						percentComplete = progress.percentComplete;
						eta = progress.eta;
					});

					// Every 5 seconds update the compress message with the %
					let editmsg = setInterval(() => {
						compressEmbed.setDescription(`Ready in ${eta === '' ? 'soon enough' : eta}. ${percentComplete}% complete.`);
						compressmsg.edit(compressEmbed);
					}, 5000);

					handbrake.on('err', (err) => {
						clearInterval(editmsg);
						compressmsg.delete();
						return message.channel.send(err, { code: true });
					});

					handbrake.on('end', (output) => {
						clearInterval(editmsg);
						compressmsg.delete();
						file = fs.statSync(output);
						fileSize = file.size / 1000000.0;

						if (fileSize > 8) return message.channel.send('End results is too big for discord.');

						return message.channel.send({embed: Embed, files: [output]})
							.catch(err => {
								console.error(err);
								return message.channel.send('File too big');
							})
							.then(() => {
								// Delete file after it has been sent
								fs.unlinkSync(output);
								message.delete();
							});
					});
				} else {
					return message.channel.send({embed: Embed, files: [output]})
						.catch(err => {
							console.error(err);
							return message.channel.send('File too big');
						})
						.then(() => {
							// Delete file after it has been sent
							fs.unlinkSync(output);
							message.delete();
						});
				}
			});
	}
}

module.exports = DownloadCommand;