const { Command } = require('discord-akairo');
const fetch = require('node-fetch');

class wallpaperCommand extends Command {
	constructor() {
		super('wallpaper', {
			aliases: ['wallpaper'],
			category: 'fun',
			clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
			description: {
				content: 'Show the Bing wallpaper of the day',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message) {
		fetch('https://bing.biturl.top/?mkt=en-US')
			.then(res => {
				return res.json();
			})
			.then(res => {
				console.log(res);

				const wallpaperEmbed = this.client.util.embed()
					.setColor(message.member.displayHexColor)
					.setTitle('Bing wallpaper of the day')
					.addField('Copyright', `[${res.copyright}](${res.copyright_link})`)
					.setDescription('[1366](https://bing.biturl.top/?resolution=1366&format=image&mkt=en-US) | [1920](https://bing.biturl.top/?resolution=1920&format=image&mkt=en-US)')
					.setImage(res.url);

				return message.channel.send(wallpaperEmbed);
			});
	}
}

module.exports = wallpaperCommand;