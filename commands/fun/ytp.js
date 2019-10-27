const { Command } = require('discord-akairo');
const YTPGenerator = require('ytpplus-node');
const os = require('os');
const fs = require('fs');
const youtubedl = require('youtube-dl');
const { prefix } = require('../../config.json');

class ytpCommand extends Command {
	constructor() {
		super('ytp', {
			aliases: ['ytp', 'ytpplus', 'ytp+'],
			category: 'fun',
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
					id: 'link',
					type: 'string'
				}
			],
			description: {
				content: 'Generate random ytp (--add with a link or attachment to add a video to the pool, only .mp4 work)',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message, args) {
		if (args.pool) {
			return message.channel.send(`here is currently ${fs.readdirSync('./asset/ytp/userVid/').length} videos, you can add yours by doing \`\`${prefix[0]} ytp --add (link or attachment)\`\``);
		}

		if (args.add) {
			let loadingmsg = await message.channel.send('Downloading <a:loadingmin:527579785212329984>');
			let Attachment = (message.attachments).array();
			let url = args.link;
			// Get attachment link
			if (Attachment[0] && !args.link) {
				url = Attachment[0].url;
			}
			
			if (url) {
				return youtubedl.exec(url, ['-o', `./asset/ytp/userVid/${message.id}.mp4`], {}, function(err) {
					if (err) {
						console.error(err);
						loadingmsg.delete();
						return message.channel.send('An error has occured, I can\'t download from the link you provided.');
					} else {
						let length = fs.readdirSync('./asset/ytp/userVid/').length;
						loadingmsg.delete();
						return message.reply(`Video sucessfully added to the pool! There is now ${length} videos`);
					}
				});
			} else {
				loadingmsg.delete();
				return message.channel.send('You need a valid video link!');
			}
		} 

		if (!message.channel.nsfw) return message.channel.send('Please execute this command in an NSFW channel ( Content might not be NSFW but since the video are user submitted better safe than sorry )');
		let loadingmsg = await message.channel.send(`Processing, this can take a **long** time, i'll ping you when i finished <a:loadingmin:527579785212329984>\nSome info: There is currently ${fs.readdirSync('./asset/ytp/userVid/').length} videos, you can add yours by doing \`\`${prefix[0]} ytp --add (link or attachment)\`\``);

		// Read userVid folder and only take .mp4
		let asset = [];
		fs.readdir('./asset/ytp/userVid/', (err, files) => {
			files.forEach(file => {
				if (file.endsWith('.mp4')) {
					asset.push(`./asset/ytp/userVid/${file}`);
				}
			});

			let options = {  
				debug: false, // Better set this to false to avoid flood in console
				MIN_STREAM_DURATION: Math.floor((Math.random() * 2) + 1), // Random duration of video clip
				sources: './asset/ytp/sources/',
				sounds: './asset/ytp/sounds/',
				music: './asset/ytp/music/',
				resources: './asset/ytp/resources/',
				temp: os.tmpdir(),
				sourceList: asset,
				outro: './asset/ytp/outro.mp4', // Need an outro or it won't work
				OUTPUT_FILE: `${os.tmpdir()}/${message.id}_YTP.mp4`,
				MAX_CLIPS: 20,
				transitions: true,
				effects: {  
					effect_RandomSound: true,
					effect_RandomSoundMute: true,
					effect_Reverse: true,
					effect_Chorus: true,
					effect_Vibrato: true,
					effect_HighPitch: true,
					effect_LowPitch: true,
					effect_SpeedUp: true,
					effect_SlowDown: true,
					effect_Dance: true,
					effect_Squidward: false
				}
			};
	
			new YTPGenerator().configurateAndGo(options)
				.then(() => {
					loadingmsg.delete();
					return message.reply('Here is your YTP!', {files: [`${os.tmpdir()}/${message.id}_YTP.mp4`]})
						.catch(() => {
							return message.channel.send('Whoops, look like the vid might be too big for discord, my bad, please try again');
						});
				})
				.catch(() => {
					loadingmsg.delete();
					return message.reply('Oh no! An error has occured!');
				});
		});
	}
}

module.exports = ytpCommand;