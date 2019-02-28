const { Command } = require('discord-akairo');
const Filter = require('bad-words');
let filter = new Filter();
const fetch = require('node-fetch');
const reload = require('auto-reload');
const rand = require('../../rand.js');
const { fbChannel, fbToken } = require('../../config.json');

class facebookCommand extends Command {
	constructor() {
		super('facebook', {
			aliases: ['facebook', 'fb'],
			category: 'general',
			args: [
				{
					id: 'text',
					type: 'string',
					match: 'rest'
				}
			],
			description: {
				content: 'Post your message to the bot facebook page',
				usage: '[text]',
				examples: ['epic']
			}
		});
	}

	async exec(message, args) {
		let text = args.text;

		let censor = reload('../../json/censor.json');
		let uncensor = reload('../../json/uncensor.json');
		filter.addWords(...censor);
		filter.removeWords(...uncensor);

		const blacklist = reload('../../json/Blacklist.json');
		const channel = this.client.channels.get(fbChannel);

		if (blacklist.includes(message.author.id)) {
			return message.channel.send('You have been blacklisted from this command... be less naughty next time.');
		}

		//Filter out swear word
		text = filter.clean(text);

		text = rand.random(text, message);
		text = encodeURI(text);

		fetch(`https://graph.facebook.com/v3.2/1254967721332652/feed?message=${text}&access_token=${fbToken}`, {
			method: 'post',
		}).then((response) => {
			return response.json();
		}).then((response) => { 
			console.log(response);
			let postID;
			if (response.id) {
				postID = response.id.slice(17);
			}
			message.channel.send(`Go see ur epic post https://www.facebook.com/HahaYesDiscord/posts/${postID}`);
			channel.send(`AUTHOR: ${message.author.username} (${message.author.id}) Sent: ${args.text}\nhttps://www.facebook.com/HahaYesDiscord/posts/${postID}`);
		});
	}
}

module.exports = facebookCommand;