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
			ownerOnly: 'true', // Owner only until i am sure there is no security issue
			args: [
				{
					id: 'url',
					type: 'string'
				},
				{
					id: 'fullpage',
					type: 'flag',
					flag: '--full'
				}
			],
			channelRestriction: 'guild',
			description: {
				content: 'Take a screenshot of a website',
				usage: '[link to a website]',
				examples: ['www.google.com']
			}
		});
	}

	async exec(message, args) {
		let Embed = this.client.util.embed()
			.setColor(message.member.displayHexColor)
			.setTitle(args.url);

		let loadingmsg = await message.channel.send('Taking a screenshot <a:loadingmin:527579785212329984>');

		// eslint-disable-next-line no-useless-escape
		let urlregex = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/);
		if (args.url.match(urlregex)) { // Only allow link with http/https
			await captureWebsite.file(args.url, `${os.tmpdir()}/${message.id}.jpg`, {
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
		} else {
			loadingmsg.delete();
			return message.channel.send('The URL you used doesn\'t correspond to a website!');
		}
	}
}
module.exports = screenshotCommand;