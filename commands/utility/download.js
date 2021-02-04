const { Command } = require('discord-akairo');
const downloader = require('../../utils/download');
const compress = require('../../utils/compress');
const { proxy, Hapi } = require('../../config.json');
const os = require('os');
const fs = require('fs');
const fetch = require('node-fetch');

class DownloadCommand extends Command {
	constructor() {
		super('download', {
			aliases: ['download', 'dl'],
			category: 'utility',
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES'],
			args: [
				{
					id: 'link',
					type: 'url',
					prompt: {
						start: 'Please send the URL of which video you want to download. Say `cancel` to stop the command',
						retry: 'Please send a valid URL of the video you want to download. Say `cancel` to stop the command',
						optional: true
					},
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
				},
				{
					id: 'proxy',
					match: 'option',
					flag: ['--proxy'],
				},
				{
					id: 'listproxy',
					match: 'flag',
					flag: ['--listproxy', '--proxylist']
				}
			],
			description: {
				content: 'Download videos from different website from the link you provided\n`-s` to make the video as a spoiler\n`--proxy #` to select a proxy\n`--listproxy` to see a list of proxy',
				usage: '[link] [caption]',
				examples: ['https://www.youtube.com/watch?v=6n3pFFPSlW4 Look at this funny gnome', 'https://www.youtube.com/watch?v=6n3pFFPSlW4 --proxy 1', '--listproxy']
			}
		});
	}

	async exec(message, args) {
		console.log(args.proxy);
		if (args.listproxy) {
			let proxys = [];

			let i = 0;
			proxy.forEach(proxy => {
				i++;
				proxys.push(`[${i}] ${ proxy.hideip ? '[IP HIDDEN]' : proxy.ip.substring(0, proxy.ip.length - 5)} - ${proxy.country}`);
			});

			const Embed = this.client.util.embed()
				.setColor(message.member ? message.member.displayHexColor : 'NAVY')
				.setTitle('List of available proxy')
				.setDescription(proxys.join('\n'))
				.setFooter('You can help me get more proxy by either donating to me or providing a proxy for me');

			return message.channel.send(Embed);
		}

		if (!args.link) return message.channel.send('Please try again with a valid URL.');
		let filename = `${message.id}_video`;

		if (args.proxy && !args.proxyAuto) { // args.proxyAuto is only provided when the command is run after a error 429
			args.proxy = args.proxy - 1;
			if (!proxy[args.proxy]) args.proxy = 0;
		}

		if (args.spoiler) {
			filename = `SPOILER_${message.id}_video`;
		}

		downloader(args.link.href, args.proxy != null ? ['--proxy', proxy[args.proxy].ip] : null, `${os.tmpdir()}/${filename}.mp4`)
			.on('error', async err => {
				if (err.includes('HTTP Error 429: Too Many Requests')) {
					if (args.proxy != null) {
						args.proxy = args.proxy + 1;
					} else {
						args.proxy = 0;
						args.proxyAuto = true;
					}

					if (!proxy[args.proxy]) return message.channel.send('`HTTP Error 429: Too Many Requests.`\nThe website you tried to download from probably has the bot blocked along with its proxy');

					loadingmsg.delete();
					return this.client.commandHandler.runCommand(message, this.client.commandHandler.findCommand('download'), args);
				}

				if (err.includes('Error: status code 403')) return message.channel.send('`HTTP Error 403: Forbidden.`\nThe video you tried to download is not publicly available therefor the bot can\'t download it.');

				return message.channel.send(err, { code: true });
			})
			.on('end', async output => {
				let file = fs.statSync(output);
				let fileSize = file.size / 1000000.0;

				if (fileSize > 8) {
					loadingmsg.delete();

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
						file = fs.statSync(output);
						fileSize = file.size / 1000000.0;

						if (fileSize > 8) return message.channel.send('End results is too big for discord.');

						return message.channel.send({embed: Embed, files: [output]})
							.catch(err => {
								compressmsg.delete();
								console.error(err);
								return message.channel.send(`${err.name}: ${err.message} ${err.message === 'Request entity too large' ? 'The file size is too big' : ''}`);
							})
							.then(() => {
								compressmsg.delete();
								// Delete file after it has been sent
								fs.unlinkSync(output);
								message.delete();
							});
					});
				} else {
					return message.channel.send({embed: Embed, files: [output]})
						.catch(err => {
							loadingmsg.delete();
							console.error(err);
							return message.channel.send(`${err.name}: ${err.message} ${err.message === 'Request entity too large' ? 'The file size is too big' : ''}`);
						})
						.then(() => {
							loadingmsg.delete();
							// Delete file after it has been sent
							fs.unlinkSync(output);
							message.delete();
						});
				}
			});
	}
}

module.exports = DownloadCommand;