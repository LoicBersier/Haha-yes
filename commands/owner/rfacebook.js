const { Command } = require('discord-akairo');
const fetch = require('node-fetch');
const { fbToken, fbID } = require('../../config.json');

class rfacebookCommand extends Command {
	constructor() {
		super('rfacebook', {
			aliases: ['rfacebook', 'rfb'],
			category: 'general',
			cooldown: 86400000,
			ratelimit: 3,
			args: [
				{
					id: 'id',
					type: 'string',
					match: 'rest'
				}
			],
			description: {
				content: 'Post your message to the bot rfacebook page',
				usage: '[text]',
				examples: ['epic']
			}
		});
	}

	async exec(message, args) {
		fetch(`https://graph.facebook.com/${fbID}_${args.id}?access_token=${fbToken}`, {
			method: 'delete',
		}).then((response) => {
			return response.json();
		}).then((response) => { 
			console.log(response.success);
			if (response.success) {
				return 	message.channel.send('Sucessfully deleted the post');
			} else {
				return message.channel.send('An error has occured :(');
			}
		});
	}
}

module.exports = rfacebookCommand;