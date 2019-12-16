const { Command } = require('discord-akairo');
const Twit = require('twit');
const fetch = require('node-fetch');
const os = require('os');
const fs = require('fs');
const rand = require('../../rand.js');
//const Filter = require('bad-words');
//let filter = new Filter();
const TwitterBlacklist = require('../../models').TwitterBlacklist;
const { twiConsumer, twiConsumerSecret, twiToken, twiTokenSecret, twiChannel } = require('../../config.json');

class tweetCommand extends Command {
	constructor() {
		super('tweet', {
			aliases: ['tweet'],
			category: 'general',
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
			cooldown: 3600000,
			ratelimit: 3,
			args: [
				{
					id: 'text',
					type: 'string',
					match: 'rest'
				}
			],
			description: {
				content: 'Send tweet from Haha yes twitter account (NOTE: all the tweet sent using this command are logged, so don\'t say nasty thing or you might get blacklisted from it!)',
				usage: '[text]',
				examples: ['this epic tweet is in my epic twitter']
			}
		});
	}

	async exec(message, args) {
		let date = new Date();
		let Attachment = (message.attachments).array();
		// see if user is not banned
		const blacklist = await TwitterBlacklist.findOne({where: {userID:message.author.id}});
		if (blacklist) {
			return message.channel.send(`You have been blacklisted for the following reasons: \`\`${blacklist.get('reason')}\`\` be less naughty less time.`);
		}

		// If account is younger than 6 months old don't accept attachment
		if (Attachment[0] && message.author.createdAt > date.setMonth(date.getMonth() - 6)) {
			return message.channel.send('Your account need to be 6 months or older to be able to send attachment!');
		} 
		
		// Don't let account new account use this command to prevent spam
		if (message.author.createdAt > date.setDate(date.getDate() - 7)) {
			return message.channel.send('Your account is too new to be able to use this command!');
		}
		
		if (!Attachment[0] && !args.text) return message.channel.send('You need to input something for me to tweet!');
		
		const client = this.client;

		let T = new Twit({
			consumer_key: twiConsumer,
			consumer_secret: twiConsumerSecret,
			access_token: twiToken,
			access_token_secret: twiTokenSecret
		});

		/*
		// Censor words
		let censor = reload('../../json/censor.json');
		let uncensor = reload('../../json/uncensor.json');
		filter.addWords(...censor);
		filter.removeWords(...uncensor);
		*/

		// remove zero width space
		let text = '';
		if (args.text) {
			text = args.text.replace('​', '');

			/*
			//Filter out swear word
			text = filter.clean(text);
			*/

			text = rand.random(text, message);
		}

		try {
			// Make sure there is an attachment and if its an image
			if (Attachment[0]) {
				if (Attachment[0].name.endsWith('.jpg') || Attachment[0].name.endsWith('.png') || Attachment[0].name.endsWith('.gif')) {
					fetch(Attachment[0].url)
						.then(res => {
							const dest = fs.createWriteStream(`${os.tmpdir()}/${Attachment[0].name}`);
							res.body.pipe(dest);
							dest.on('finish', () => {
								let file = fs.statSync(`${os.tmpdir()}/${Attachment[0].name}`);
								let fileSize = file.size / 1000000.0;

								if ((Attachment[0].name.endsWith('.jpg') || Attachment[0].name.endsWith('.png')) && fileSize > 5) {
									return message.channel.send('Images can\'t be larger than 5 MB!');
								} else if (Attachment[0].name.endsWith('.gif') && fileSize > 15) {
									return message.channel.send('Gifs can\'t be larger than 15 MB!');
								}
								
								let b64Image = fs.readFileSync(`${os.tmpdir()}/${Attachment[0].name}`, { encoding: 'base64'});
								T.post('media/upload', { media_data: b64Image }, function (err, data) {
									if (err) {
										console.log('OH NO AN ERROR!!!!!!!');
										console.error(err);
										return message.channel.send('OH NO!!! AN ERROR HAS OCCURED!!! please hold on while i find what\'s causing this issue! ');
									} else {
										Tweet(data);
									}
								});
							});
						});
				} else {
					return message.channel.send('File type not supported, you can only send jpg/png/gif');
				}
			} else {
				Tweet();
			}
		} catch(err) {
			console.error(err);
			return message.channel.send('Oh no, an error has occured :(');
		}

		function Tweet(data) {
			let options = {
				status: text
			};

			if (data && args.text) {
				options = {
					status: text,
					media_ids: new Array(data.media_id_string)
				};
			} else if (data) {
				options = {
					media_ids: new Array(data.media_id_string)
				};
			}

			T.post('statuses/update', options, function (err, response) {
				if (err) {
					if (err.code == 88) return message.channel.send(err.message); // Rate limit exceeded	
					if (err.code == 186) return message.channel.send(`${err.message} Your message was ${text.length} characters, you need to remove ${text.length - 280} characters (This count may be inaccurate if your message contained link)`); // Tweet needs to be a bit shorter.	
					if (err.code == 187) return message.channel.send(err.message); // Status is a duplicate.
					if (err.code == 326) return message.channel.send(err.message); // To protect our users from spam and other malicious activity, this account is temporarily locked.
					console.error('OH NO!!!!');
					console.error(err);
					return message.channel.send('OH NO!!! AN ERROR HAS OCCURED!!! please hold on while i find what\'s causing this issue! ');
				} 
	
				const tweetid = response.id_str;
				const publicEmbed = client.util.embed()
					.setAuthor('Some user of discord said...')
					.setDescription(text)
					.addField('Link', `https://twitter.com/i/status/${tweetid}`)
					.setTimestamp();
				
				if (Attachment[0]) publicEmbed.setImage(Attachment[0].url);

				// Im too lazy for now to make an entry in config.json
				let channel = client.channels.get('597964498921455637');
				channel.send({embed: publicEmbed});
	
				const Embed = client.util.embed()
					.setAuthor(message.author.username, message.author.displayAvatarURL())
					.setDescription(args.text)
					.addField('Link', `https://twitter.com/i/status/${tweetid}`, true)
					.addField('Tweet ID', tweetid, true)
					.addField('Author', `${message.author.username} (${message.author.id})`, true)
					.addField('Guild', `${message.guild.name} (${message.guild.id})`, true)
					.setTimestamp();

				if (Attachment[0]) Embed.setImage(Attachment[0].url);
				
				channel = client.channels.get(twiChannel);
				channel.send({embed: Embed});
				return message.channel.send(`Go see ur epic tweet https://twitter.com/i/status/${tweetid}`);
			});
		}

	}
}

module.exports = tweetCommand;