//TODO
//FIX INDENT
//PUT TWITTER KEY ON CONFIG.JSON
//SEND FEEDBACK ONCE THE COMMAND HAVE BEEN EXECUTED
const { Command } = require('discord-akairo');
const Twitter = require('twitter');
const rand = require('../../rand.js');

class twitterCommand extends Command {
	constructor() {
		super('twitter', {
			aliases: ['twitter'],
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

        let client = new Twitter({
            consumer_key: '',
            consumer_secret: '',
            access_token_key: '',
            access_token_secret: ''
          });

		let text = args.text;
		if (!text)
			return;

        text = rand.random(text, message);
        
        client.post('statuses/update', {status: 'test'}, function(error, tweet, response) {
            if (!error) {
              console.log(tweet);
            }
            console.log(response);
        });

		//	  Send the final text
		return message.channel.send('epic');
	}
}

module.exports = twitterCommand;