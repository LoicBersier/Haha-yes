const { Command } = require('discord-akairo');
const captureWebsite = require('capture-website');
const os = require('os');
const fs = require('fs');

class screenshotCommand extends Command {
	constructor() {
		super('screenshot', {
			aliases: ['screenshot', 'webshot', 'ss'],
			category: 'utility',
			clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
			args: [
				{
					id: 'url',
					type: 'string',
					prompt: {
						start: 'Please send a link of which website you want to take a screenshot of.',
						retry: 'This does not look like an url, please try again.'
					}
				},
				{
					id: 'fullpage',
					type: 'flag',
					flag: '--full'
				}
			],
			description: {
				content: 'Take a screenshot of a website. Need to start with http(s)://. Use --full to take a full page capture',
				usage: '[link to a website] [optional: --full]',
				examples: ['https://google.com', 'https://namejeff.xyz --full']
			}
		});
	}

	async exec(message, args) {
		let url = args.url;
		if (!url.includes('http')) url = `http://${url}`;
		if (url.includes('config.json') || url.includes('file://')) return message.channel.send('I don\'t think so');
		let Embed = this.client.util.embed()
			.setColor(message.member ? message.member.displayHexColor : 'NAVY')
			.setTitle(url);

		let loadingmsg = await message.channel.send('Taking a screenshot <a:loadingmin:527579785212329984>');
		
		await captureWebsite.file(url, `${os.tmpdir()}/${message.id}.jpg`, {
			type: 'jpeg',
			headers: {
				'Accept-Language': 'en-GB'
			},
			fullPage: args.fullpage
		})
			.catch((err) => {
				console.error(err);
				Embed.setDescription(err.toString());
				loadingmsg.delete();
				return message.channel.send(Embed);
			})
			.then(() => {
				if (fs.existsSync(`${os.tmpdir()}/${message.id}.jpg`)) {
					Embed.attachFiles([`${os.tmpdir()}/${message.id}.jpg`]);
					Embed.setImage(`attachment://${message.id}.jpg`);
					loadingmsg.delete();
					return message.channel.send(Embed);
				}
			});
	}
}
module.exports = screenshotCommand;