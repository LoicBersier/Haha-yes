const { Command } = require('discord-akairo');
const { proxy } = require('../../config.json');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

class PetitTubeCommand extends Command {
	constructor() {
		super('petittube', {
			aliases: ['petittube', 'pt'],
			category: 'fun',
			clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
			args: [
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
				content: 'Fetch a video from https://petittube.com/',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message, args) {
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

		const response = await fetch('https://petittube.com/');
		const body = await response.text();

		const $ = cheerio.load(body);

		const url = $('iframe')[0].attribs.src;

		if (args.proxy) {
			args.proxy = args.proxy -1;
			if (!proxy[args.proxy]) args.proxy = 0;
		}

		this.client.commandHandler.runCommand(message, this.client.commandHandler.findCommand('download'), { link: new URL(url), proxy: args.proxy, spoiler: !message.channel.nsfw, caption: message.channel.nsfw ? '' : 'Video might be NSFW as always, be careful!'});
	}
}
module.exports = PetitTubeCommand;