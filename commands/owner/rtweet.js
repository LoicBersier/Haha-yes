const { Command } = require('discord-akairo');
const Twit = require('twit');
const { twiConsumer, twiConsumerSecret, twiToken, twiTokenSecret } = require('../../config.json');

class rtweetCommand extends Command {
	constructor() {
		super('rtweet', {
			aliases: ['rtweet', 'rmtweet'],
			category: 'owner',
			ownerOnly: 'true',
			args: [
				{
					id: 'text',
					type: 'string',
					match: 'rest'
				}
			],
			description: {
				content: 'Delete a tweet',
				usage: '[tweet id]',
				examples: ['1099882994599383040']
			}
		});
	}

	async exec(message, args) {
		let text = args.text;
		try {
			let T = new Twit({
				consumer_key: twiConsumer,
				consumer_secret: twiConsumerSecret,
				access_token: twiToken,
				access_token_secret: twiTokenSecret
			});

			T.post('statuses/destroy', {
				id: text
			});
			return message.channel.send('Tweet have been deleted!');
		} catch(err) {
			console.error(err);
			return message.channel.send('Oh no, an error has occurred :(');
		}

	}
}

module.exports = rtweetCommand;