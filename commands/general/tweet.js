const { Command } = require('discord-akairo');
const Twitter = require('twitter-lite');
const rand = require('../../rand.js');
const Filter = require('bad-words');
const { MessageEmbed } = require('discord.js');
let filter = new Filter();
const { twiConsumer, twiConsumerSecret, twiToken, twiTokenSecret, twiChannel } = require('../../config.json');
const reload = require('auto-reload');

class tweetCommand extends Command {
	constructor() {
		super('tweet', {
			aliases: ['tweet'],
			category: 'general',
			args: [
				{
					id: 'text',
					type: 'string',
					prompt: {
						start: 'Write something to tweet',
					},
					match: 'rest'
				}
			],
			description: {
				content: 'Send tweet from Haha yes twitter account (NOTE: all the tweet sent using this command are logged, so don\'t say nasty thing or you might get blacklisted from it! )',
				usage: '[text]',
				examples: ['this epic tweet is in my epic twitter']
			}
		});
	}

	async exec(message, args) {
		let censor = reload('../../json/censor.json');
		let uncensor = reload('../../json/uncensor.json');
		filter.addWords(...censor);
		filter.removeWords(...uncensor);

		const blacklist = reload('../../json/twiBlacklist.json');

		if (blacklist.includes(message.author.id)) {
			return message.channel.send('You have been blacklisted from this command... be less naughty next time.');
		}

		// remove zero width space
		let text = args.text.replace('​', '');
		if (!text)
			return;

		//Filter out swear word
		text = filter.clean(text);

		text = rand.random(text, message);

		try {
			let client = new Twitter({
				consumer_key: twiConsumer,
				consumer_secret: twiConsumerSecret,
				access_token_key: twiToken,
				access_token_secret: twiTokenSecret
			});

			const response = await client.post('statuses/update', {
				status: text
			});
	
			const tweetid = response.id_str;
			
			const publicEmbed = new MessageEmbed()
				.setAuthor('Some user of discord say...')
				.setDescription(args.text)
				.addField('Link', `https://twitter.com/HahaYesDB/status/${tweetid}`)
				.setTimestamp();

			// Im too lazy for now to make an entry in config.json
			let channel = this.client.channels.get('597964498921455637');
			channel.send({embed: publicEmbed});

			const Embed = new MessageEmbed()
				.setAuthor(message.author.username, message.author.displayAvatarURL())
				.setDescription(args.text)
				.addField('Link', `https://twitter.com/HahaYesDB/status/${tweetid}`, true)
				.addField('Tweet ID', tweetid, true)
				.addField('Author', `${message.author.username} (${message.author.id})`, true)
				.addField('Guild', `${message.guild.name} (${message.guild.id})`, true)
				.setTimestamp();

			channel = this.client.channels.get(twiChannel);
			channel.send({embed: Embed});

			return message.channel.send(`Go see ur epic tweet https://twitter.com/HahaYesDB/status/${tweetid}`);
		} catch(err) {
			console.error(err);
			return message.channel.send('Oh no, an error has occured :(');
		}

	}
}

module.exports = tweetCommand;