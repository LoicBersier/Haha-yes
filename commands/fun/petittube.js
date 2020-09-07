const { Command } = require('discord-akairo');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

class PetitTubeCommand extends Command {
	constructor() {
		super('petittube', {
			aliases: ['petittube', 'pt'],
			category: 'fun',
			clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
			description: {
				content: 'Fetch a video from https://petittube.com/',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message) {
		const response = await fetch('https://petittube.com/');
		const body = await response.text();

		const $ = cheerio.load(body);

		const url = $('iframe')[0].attribs.src;

		this.client.commandHandler.runCommand(message, this.client.commandHandler.findCommand('download'), { link: new URL(url), proxy: 1, spoiler: !message.channel.nsfw, caption: message.channel.nsfw ? '' : 'Video might be NSFW as always, be careful!'});
	}
}
module.exports = PetitTubeCommand;