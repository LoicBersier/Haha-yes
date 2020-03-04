const { Command } = require('discord-akairo');
const fetch = require('node-fetch');

class wallpaperCommand extends Command {
	constructor() {
		super('wallpaper', {
			aliases: ['wallpaper'],
			category: 'utility',
			clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
			args: [
				{
					id: 'region',
					type: 'string',
					match: 'rest',
				}
			],
			description: {
				content: 'Show the Bing wallpaper of the day, can use any of the following region: zh-CN, en-US, ja-JP, en-AU, en-UK, de-DE, en-NZ, en-CA',
				usage: '[region]',
				examples: ['', 'zh-CN']
			}
		});
	}

	async exec(message, args) {
		let mkt = args.region;
		if (!args.region) mkt = 'en-US';
		if (!['zh-CN', 'en-US', 'ja-JP', 'en-AU', 'en-UK', 'de-DE', 'en-NZ', 'en-CA'].includes(mkt)) return message.channel.send('Please choose a valid region settings: zh-CN, en-US, ja-JP, en-AU, en-UK, de-DE, en-NZ, en-CA');
		fetch(`https://bing.biturl.top/?mkt=${mkt}`)
			.then(res => {
				return res.json();
			})
			.then(res => {
				const wallpaperEmbed = this.client.util.embed()
					.setColor(message.member.displayHexColor)
					.setTitle('Bing wallpaper of the day')
					.addField('Copyright', `[${res.copyright}](${res.copyright_link})`)
					.setDescription(`[1366](https://bing.biturl.top/?resolution=1366&format=image&mkt=${mkt}) | [1920](https://bing.biturl.top/?resolution=1920&format=image&mkt=${mkt})`)
					.setImage(res.url);

				return message.channel.send(wallpaperEmbed);
			});
	}
}

module.exports = wallpaperCommand;