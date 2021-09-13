const { Command } = require('discord-akairo');
const { Hapi } = require('../../config.json');
const checkHapi = require('../../utils/checkHapi');
const fetch = require('node-fetch');

class screenshotCommand extends Command {
	constructor() {
		super('screenshot', {
			aliases: ['screenshot', 'webshot', 'ss'],
			category: 'utility',
			clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
			args: [
				{
					id: 'url',
					type: 'url',
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
		if (args.url.href.includes('config.json') || args.url.href.includes('file://')) return message.channel.send('I don\'t think so');

		let Embed = this.client.util.embed()
			.setColor(message.member ? message.member.displayHexColor : 'NAVY');

		let loadingmsg = await message.channel.send('Taking a screenshot <a:loadingmin:527579785212329984>');
		const isHapiOnline = await checkHapi();

		if (isHapiOnline) {
			const params = new URLSearchParams();
			params.append('url', args.url.href);

			fetch(`${Hapi}/screenshot`, {method: 'POST', body: params})
				.then(async res => {
					console.log(res);
					console.log(`Status is: ${res.status}`);
					if (res.status === 200) {
						let json = await res.json();
						Embed.setImage(json.image);
						Embed.setTitle(json.url);
						await message.reply(Embed);
					}
					await loadingmsg.delete();
				});
		} else {
			return message.reply('Hapi server is not online, try again later!');
		}

		/*
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
		*/
	}
}
module.exports = screenshotCommand;