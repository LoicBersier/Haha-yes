const { Command } = require('discord-akairo');
const Twitter = require('twitter-lite');
const rand = require('../../rand.js');
const { twiConsumer, twiConsumerSecret, twiToken, twiTokenSecret } = require('../../config.json');

class tweetCommand extends Command {
	constructor() {
		super('tweet', {
			aliases: ['tweet'],
			category: 'general',
			args: [
				{
					id: 'text',
					type: 'string',
					match: 'rest'
				}
			],
			description: {
				content: 'Send tweet from Haha yes twitter account',
				usage: '[text]',
				examples: ['this epic tweet is in my epic twitter']
			}
		});
	}

	async exec(message, args) {
		let text = args.text;
		if (!text)
			return;

		text = rand.random(text, message);

		let client = new Twitter({
			consumer_key: twiConsumer,
			consumer_secret: twiConsumerSecret,
			access_token_key: twiToken,
			access_token_secret: twiTokenSecret
		});

		try {
			const response = await client.post('statuses/update', {
				status: text
			});
	
			const tweetid = response.id_str;
	
			//	  Send the final text
			return message.channel.send(`Go see ur epic tweet https://twitter.com/HahaYesDB/status/${tweetid}`);
		} catch(err) {
			return message.channel.send('Oh no, an error has occured :(');
		}

	}
}

module.exports = tweetCommand;