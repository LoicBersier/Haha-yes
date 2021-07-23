const { Command } = require('discord-akairo');
const Twit = require('twit');
const fetch = require('node-fetch');
const os = require('os');
const fs = require('fs');
const rand = require('../../rand.js');
//const TwitterBlacklist = require('../../models').TwitterBlacklist;
const Blacklists = require('../../models').Blacklists;
const { twiConsumer, twiConsumerSecret, twiToken, twiTokenSecret, twiChannel } = require('../../config.json');
const wordToCensor = require('../../json/censor.json');

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
				content: 'Send tweet from Haha yes twitter account. Please do not use it for advertisement (NOTE: all the tweet sent using this command are logged, so don\'t say nasty thing or you might get blacklisted from it!)',
				usage: '[text]',
				examples: ['this epic tweet is in my epic twitter']
			}
		});
	}

	async exec(message, args) {
		let Attachment = (message.attachments).array();
		if (!Attachment[0] && !args.text) return message.reply('You need to input something for me to tweet!');

		let date = new Date();
		// see if user is not banned
		/*
		const blacklist = await TwitterBlacklist.findOne({where: {userID:message.author.id}});

		if (blacklist) {
			return message.reply(`You have been blacklisted for the following reasons: \`${blacklist.get('reason')}\` be less naughty next time.`);
		}
		 */
		// If account is less than 6 months old don't accept the tweet ( alt prevention )
		if (message.author.createdAt > date.setMonth(date.getMonth() - 6)) {
			return message.reply('Your account is too new to be able to use this command!');
		}

		// If account is less than 1 year old don't accept attachment
		if (Attachment[0] && message.author.createdAt > date.setFullYear(date.getFullYear() - 1 )) {
			return message.reply('Your account need to be 1 year or older to be able to send attachment!');
		}

		// remove zero width space and use the dictionary thingy
		let text = '';
		if (args.text) {
			text = args.text.replace('​', '');

			text = rand.random(text, message);
		}

		if (text) {
			// Detect banned word (Blacklist the user directly)
			if (wordToCensor.includes(text) || wordToCensor.includes(text.substr(0, text.length - 1)) || wordToCensor.includes(text.substr(1, text.length))) {
				const body = {type:'tweet', uid: message.author.id, reason: 'Automatic ban from banned word.'};
				Blacklists.create(body);

				/*
				const body = {userID: message.author.id, reason: };
				TwitterBlacklist.create(body);
				 */
				return message.channel.send('Sike, you just posted cringe! Enjoy the blacklist :)');
			}

			// Very simple link detection
			if (new RegExp('([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?').test(args.text) && !args.text.includes('twitter.com')) return message.channel.send('You may not tweet links outside of twitter.com');
			// Do not allow discord invites
			if (args.text.includes('discord.gg') || args.text.includes('discord.com/invite/')) return message.channel.send('No discord invite allowed.');
		}

		const client = this.client;

		let T = new Twit({
			consumer_key: twiConsumer,
			consumer_secret: twiConsumerSecret,
			access_token: twiToken,
			access_token_secret: twiTokenSecret
		});

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
									return message.reply('Images can\'t be larger than 5 MB!');
								} else if (Attachment[0].name.endsWith('.gif') && fileSize > 15) {
									return message.reply('Gifs can\'t be larger than 15 MB!');
								}
								
								let b64Image = fs.readFileSync(`${os.tmpdir()}/${Attachment[0].name}`, { encoding: 'base64'});
								T.post('media/upload', { media_data: b64Image }, function (err, data) {
									if (err) {
										console.log('OH NO AN ERROR!!!!!!!');
										console.error(err);
										return message.reply('OH NO!!! AN ERROR HAS occurred!!! please hold on while i find what\'s causing this issue! ');
									} else {
										Tweet(data);
									}
								});
							});
						});
				} else {
					return message.reply('File type not supported, you can only send jpg/png/gif');
				}
			} else {
				Tweet();
			}
		} catch(err) {
			console.error(err);
			return message.reply('Oh no, an error has occurred :(');
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
					if (err.code == 88) return message.reply(err.message); // Rate limit exceeded
					if (err.code == 186) return message.reply(`${err.message} Your message was ${text.length} characters, you need to remove ${text.length - 280} characters (This count may be inaccurate if your message contained link)`); // Tweet needs to be a bit shorter.
					if (err.code == 187) return message.reply(err.message); // Status is a duplicate.
					if (err.code == 326) return message.reply(err.message); // To protect our users from spam and other malicious activity, this account is temporarily locked.
					console.error('OH NO!!!!');
					console.error(err);
					return message.reply('OH NO!!! AN ERROR HAS occurred!!! please hold on while i find what\'s causing this issue! ');
				} 
	
				const tweetid = response.id_str;
				const FunnyWords = ['oppaGangnamStyle', '69', '420', 'cum', 'funnyMan', 'GUCCISmartToilet', 'TwitterForClowns', 'fart', 'mcDotnamejeffDotxyz', 'ok', 'hi', 'howAreYou', 'WhatsNinePlusTen', '21'];
				const TweetLink = `https://twitter.com/${FunnyWords[Math.floor((Math.random() * FunnyWords.length))]}/status/${tweetid}`;

				// Im too lazy for now to make an entry in config.json
				let channel = client.channels.resolve('597964498921455637');
				channel.send(TweetLink);
	
				const Embed = client.util.embed()
					.setAuthor(message.author.username, message.author.displayAvatarURL())
					.setDescription(args.text)
					.addField('Link', TweetLink, true)
					.addField('Tweet ID', tweetid, true)
					.addField('Channel ID', message.channel.id, true)
					.addField('Messsage ID', message.id, true)
					.addField('Author', `${message.author.username} (${message.author.id})`, true)
					.setTimestamp();

				if (message.guild) {
					Embed.addField('Guild', `${message.guild.name} (${message.guild.id})`, true);
					Embed.addField('Message link', `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`);
				} else {
					Embed.addField('Message link', `https://discord.com/channels/@me/${message.channel.id}/${message.id}`);
				}

				if (Attachment[0]) Embed.setImage(Attachment[0].url);
				
				channel = client.channels.resolve(twiChannel);
				channel.send({embed: Embed});
				return message.reply(`Go see ur epic tweet ${TweetLink}`);
			});
		}

	}
}

module.exports = tweetCommand;
