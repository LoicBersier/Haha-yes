const { Command } = require('discord-akairo');
const fetch = require('node-fetch');

class ImgurCommand extends Command {
	constructor() {
		super('imgur', {
			aliases: ['badmeme', 'imgur'],
			category: 'fun',
			description: {
				content: 'Send some random images from imgur',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message) {
		fetch('https://api.imgur.com/3/gallery/hot/day?showViral=true&mature=false&perPage=100&album_previews=true', {
			headers: { 'Authorization': 'Client-ID e4cb6948f80f295' },
		}).then((response) => {
			return response.json();
		}).then((response) => {
			if (response.success == 'false')
				return message.channel.send('An error has occured');

			const i = Math.floor((Math.random() * response.data.length));

			message.channel.send(`**${response.data[i].title}**\n${response.data[i].link}`);
		});
	}
}

module.exports = ImgurCommand;