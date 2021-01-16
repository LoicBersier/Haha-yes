const { Command } = require('discord-akairo');
const { proxy } = require('../../config.json');
const YTPGenerator = require('ytpplus-node');
const os = require('os');
const fs = require('fs');
const attachment = require('../../utils/attachment');
const downloader = require('../../utils/download');
const md5File = require('md5-file');
const ytpHash = require('../../models').ytpHash;
const { ytpChannel } = require('../../config.json');
const ytpblacklist = require('../../models').ytpblacklist;

const MAX_CLIPS = 20;


class ytpCommand extends Command {
	constructor() {
		super('ytp', {
			aliases: ['ytp', 'ytpplus', 'ytp+'],
			category: 'fun',
			clientPermissions: ['ATTACH_FILES', 'SEND_MESSAGES'],
			args: [
				{
					id: 'add',
					match: 'flag',
					flag: ['--add']
				},
				{
					id: 'pool',
					match: 'flag',
					flag: ['--pool']
				},
				{
					id: 'force',
					match: 'flag',
					flag: ['--force']
				},
				{
					id: 'randomSound',
					match: 'flag',
					flag: ['--randomSound']
				},
				{
					id: 'randomSoundMute',
					match: 'flag',
					flag: ['--randomSoundMute']
				},
				{
					id: 'reverse',
					match: 'flag',
					flag: ['--reverse']
				},
				{
					id: 'chorus',
					match: 'flag',
					flag: ['--chorus']
				},
				{
					id: 'vibrato',
					match: 'flag',
					flag: ['--vibrato']
				},
				{
					id: 'highPitch',
					match: 'flag',
					flag: ['--highPitch']
				},
				{
					id: 'lowPitch',
					match: 'flag',
					flag: ['--lowPitch']
				},
				{
					id: 'speedUp',
					match: 'flag',
					flag: ['--speedUp']
				},
				{
					id: 'slowDown',
					match: 'flag',
					flag: ['--slowDown']
				},
				{
					id: 'dance',
					match: 'flag',
					flag: ['--dance']
				},
				{
					id: 'squidward',
					match: 'flag',
					flag: ['--squidward']
				},
				{
					id: 'how',
					match: 'flag',
					flag: ['--how']
				},
				{
					id: 'debug',
					match: 'flag',
					flag: ['--debug']
				},
				{
					id: 'link',
					type: 'url',
					prompt: {
						start: 'Please send the URL of which video you want to download. Say `cancel` to stop the command',
						retry: 'Please send a valid URL of the video you want to download. Say `cancel` to stop the command',
						optional: true,
					},
					unordered: true
				},
				{
					id: 'max',
					type: 'string',
					unordered: true
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
				content: 'Generate random ytp\n--add with a link or attachment to add a video to the pool, only .mp4 work **(Everything submitted here is logged and can get you blacklisted if you post lots of repeated content, post porn/gore, post TOS breaking content)**\n--pool to see how many vid there is currently in the pool\n--force to make the command work outside of nsfw channel BE AWARE THAT IT WON\'T CHANGE THE FINAL RESULT SO NSFW CAN STILL HAPPEN\n`--proxy #` to select a proxy, `--listproxy` to see a list of proxy',
				usage: '(OPTIONAL) | [Minimum length of clip] [Max length of clip]',
				examples: ['5 10', '--add https://www.youtube.com/watch?v=6n3pFFPSlW4', '--add https://www.youtube.com/watch?v=6n3pFFPSlW4 --proxy 1', '--listproxy']
			}
		});
	}

	async exec(message, args) {
		if (args.pool) {
			let mp4 = [];
			fs.readdirSync('./asset/ytp/userVid/').forEach(file => {
				if (file.endsWith('mp4')) {
					mp4.push(file);
				}
			});

			return message.channel.send(`There is currently ${mp4.length} videos, you can add yours by doing \`\`${this.client.commandHandler.prefix[0]}ytp --add (link or attachment)\`\``);
		}

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

		if (args.add) {
			const blacklist = await ytpblacklist.findOne({where: {userID:message.author.id}});

			if (blacklist) {
				return message.channel.send(`You have been blacklisted for the following reasons: \`${blacklist.get('reason')}\` be less naughty next time.`);
			}

			if (args.proxy && !args.proxyAuto) { // args.proxyAuto is only provided when the command is run after a error 429
				args.proxy = args.proxy -1;
				if (!proxy[args.proxy]) args.proxy = 0;
			}

			let loadingmsg = await message.channel.send('Downloading <a:loadingmin:527579785212329984>');
			let url;

			if (args.link)
				url = args.link.href;
			else
				url = await attachment(message);

			if (url) {
				let options = ['--format=mp4'];

				if (args.proxy) {
					options.push('--proxy');
					options.push(proxy[args.proxy].ip);
				}

				return downloader(url, options, `./asset/ytp/userVid/${message.id}.mp4`)
					.on('error', (err) => {
						if (err.includes('HTTP Error 429: Too Many Requests')) {
							if (args.proxy != null) {
								args.proxy = args.proxy + 1;
							} else {
								args.proxy = 0;
								args.proxyAuto = true;
							}

							if (!proxy[args.proxy]) return message.channel.send('`HTTP Error 429: Too Many Requests.`\nThe website you tried to download from probably has the bot blocked along with its proxy');

							loadingmsg.delete();
							return this.client.commandHandler.runCommand(message, this.client.commandHandler.findCommand('ytp'), args);
						}

						if (err.includes('Error: status code 403')) return message.channel.send('`HTTP Error 403: Forbidden.`\nThe video you tried to download is not publicly available therefor the bot can\'t download it.');

						return message.channel.send(err, { code: true });

					})
					.on('end', async output => {
						const hash = md5File.sync(output);
						const ytphash = await ytpHash.findOne({where: {hash: hash}});

						if (ytphash) {
							fs.unlinkSync(output);
							loadingmsg.delete();
							return message.reply('This video is a duplicate... Not adding.');
						} else {
							let file = fs.statSync(output);
							let fileSize = file.size / 1000000.0;

							if (fileSize > 50) {
								fs.unlinkSync(output);
								loadingmsg.delete();
								return message.reply('Video too big.. Not adding.');
							}

							const body = {hash: hash, messageID: message.id};
							await ytpHash.create(body);
						}


						let mp4 = [];
						fs.readdirSync('./asset/ytp/userVid/').forEach(file => {
							if (file.endsWith('mp4')) {
								mp4.push(file);
							}
						});

						// (Hopefully) limit video to 2k
						if (mp4.length > 2000) {
							let file = mp4.sort((a, b) => {
								let time1 = fs.statSync(`./asset/ytp/userVid/${b}`).ctime;
								let time2 = fs.statSync(`./asset/ytp/userVid/${a}`).ctime;
								if (time1 < time2) return 1;
								if (time1 > time2) return -1;
								return 0;
							}).slice(0,1);
							console.log(file);
							fs.unlinkSync(`./asset/ytp/userVid/${file[0]}`);
						}

						loadingmsg.delete();
						message.reply(`Video successfully added to the pool! There is now ${mp4.length} videos`);

						const Embed = this.client.util.embed()
							.setAuthor(message.author.username, message.author.displayAvatarURL())
							.addField('Channel ID', message.channel.id, true)
							.addField('Messsage ID', message.id, true)
							.addField('Author', `${message.author.username} (${message.author.id})`, true)
							.setTimestamp();

						if (message.guild) {
							Embed.addField('Guild', `${message.guild.name} (${message.guild.id})`, true);
							Embed.addField('Message link', `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`);
						} else {
							Embed.addField('Message link', `https://discord.com/channels/@me/${message.channel.id}/${message.id}`);
						}

						let channel = this.client.channels.resolve(ytpChannel);
						return channel.send(url, {embed: Embed});
					});
			} else {
				loadingmsg.delete();
				return message.channel.send('You need a valid video link!');
			}
		}


		if (!message.channel.nsfw && !args.force) return message.channel.send(`Please execute this command in an NSFW channel ( Content might not be NSFW but since the video are user submitted better safe than sorry ) OR do \`\`${this.client.commandHandler.prefix[0]}ytp --force\`\` to make the command work outside of nsfw channel BE AWARE THAT IT WON'T CHANGE THE FINAL RESULT SO NSFW CAN STILL HAPPEN`);

		// Read userVid folder and select random vid and only take .mp4
		let mp4 = [];
		let asset = [];
		// Count number of total vid
		fs.readdirSync('./asset/ytp/userVid/').forEach(file => {
			if (file.endsWith('mp4')) {
				mp4.push(file);
			}
		});

		// Select random vid depending on the amount of MAX_CLIPS
		for (let i = 0; i < MAX_CLIPS; i++) {
			let random = Math.floor(Math.random() * mp4.length);
			let vid = `./asset/ytp/userVid/${mp4[random]}`;
			if (mp4[random].endsWith('mp4')) {
				if (!asset.includes(vid)) {
					asset.push(vid);
				}
			}
		}

		let loadingmsg = await message.channel.send(`Processing, this can take a ***long*** time, i'll ping you when i finished <a:loadingmin:527579785212329984>\nSome info: There are currently ${mp4.length} videos, you can add yours by doing \`\`${this.client.commandHandler.prefix[0]}ytp --add (link or attachment). Thanks for contributing!\`\``);


		let options = {
			debug: args.debug,
			MIN_STREAM_DURATION: args.link ? Math.floor(args.link) : null,
			MAX_STREAM_DURATION: args.link && args.max ? args.max : Math.floor((Math.random() * 3) + 1), // Random duration of video clip
			sources: './asset/ytp/sources/',
			sounds: './asset/ytp/sounds/',
			music: './asset/ytp/music/',
			resources: './asset/ytp/resources/',
			temp: os.tmpdir(),
			sourceList: asset,
			intro: args.force ? './asset/ytp/intro.mp4' : null,
			outro: './asset/ytp/outro.mp4',
			OUTPUT_FILE: `${os.tmpdir()}/${message.id}_YTP.mp4`,
			MAX_CLIPS: MAX_CLIPS,
			transitions: true,
			showFileNames: true,
			effects: {
				effect_RandomSound: !args.randomSound,
				effect_RandomSoundMute: !args.randomSoundMute,
				effect_Reverse: !args.reverse,
				effect_Chorus: !args.chorus,
				effect_Vibrato: !args.vibrato,
				effect_HighPitch: !args.highPitch,
				effect_LowPitch: !args.lowPitch,
				effect_SpeedUp: !args.speedUp,
				effect_SlowDown: !args.slowDown,
				effect_Dance: !args.dance,
				effect_Squidward: !args.squidward,
				effect_How: !args.how
			}
		};

		new YTPGenerator().configurateAndGo(options)
			.then(() => {
				md5File(`${os.tmpdir()}/${message.id}_YTP.mp4`).then(async hash => {
					const body = {hash: hash, messageID: message.id};
					await ytpHash.create(body);
				});
				loadingmsg.delete();
				return message.reply('Here is your YTP! Remember, it might contain nsfw, so be careful!', {files: [`${os.tmpdir()}/${message.id}_YTP.mp4`]})
					.catch(err => {
						console.error(err);
						return message.channel.send('Whoops, look like the vid might be too big for discord, my bad, please try again');
					});
			})
			.catch(err => {
				console.error(err);
				loadingmsg.delete();
				if (!args.retry)
					args.retry = 0;
				else
					args.retry += 1;

				if (args.retry === 3) {
					return message.reply({files: [Math.random() < 0.5 ? './asset/ytp/error1.mp4' : './asset/ytp/error2.mp4']})
						.catch(err => { // In case it can't send the video for some reason
							console.error(err);
							return message.channel.send('Oh no, an error has occurred! please try again. If this happens alot, you should report this to the developers.');
						});
				}

				return this.client.commandHandler.runCommand(message, this.client.commandHandler.findCommand('ytp'), args);
			});
	}
}

module.exports = ytpCommand;
