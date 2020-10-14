const { Listener } = require('discord-akairo');
const rand = require('../../rand.js');
const Sequelize = require('sequelize');
const safe = require('safe-regex');
// Database
const Tag = require('../../models').Tag;
const autoResponse = require('../../models').autoresponse;
const autoResponseStat = require('../../models').autoresponseStat;
const BannedWords = require('../../models').bannedWords;
const WhitelistWord = require('../../models').whitelistWord;
const quotationStat = require('../../models').quotationStat;
const userBlacklist = require('../../models').userBlacklist;


class messageListener extends Listener {
	constructor() {
		super('message', {
			emitter: 'client',
			event: 'message'
		});
	}

	async exec(message) {
		const blacklist = await userBlacklist.findOne({where: {userID:message.author.id}});

		if (blacklist) return;

		if (message.partial) {
			await message.fetch()
				.catch(err => {
					return console.error(err);
				});
		}

		if (message.author.bot) return;

		/*	Banned words section
		*
		*	This section contains code about the banned words features
		*
		*/

		// Banned words
		let bannedWords = [];
		let whitelistWord = [];

		if (message.guild) { // I forgot how the FUCK it work, that's what i get for not commenting my code
			bannedWords = await BannedWords.findAll({where: {word: Sequelize.where(Sequelize.fn('LOCATE', Sequelize.col('word'), message.content.replace(/\u200B/g, '').replace(/[\u0250-\ue007]/g, '')), Sequelize.Op.ne, 0), serverID: message.guild.id}});
			whitelistWord = await WhitelistWord.findAll({where: {word: message.content.replace(/\u200B/g, '').replace(/[\u0250-\ue007]/g), serverID: message.guild.id}});
		}

		if (whitelistWord[0]) {
			return; // If word is whitelisted just return
		}

		if (bannedWords[0]) {
			// Remove accent
			let censoredMessage = message.content.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
			// Remove zero width space character
			censoredMessage = censoredMessage.replace(/\u200B/g, '');
			// Remove non latin character
			censoredMessage = censoredMessage.replace(/[\u0250-\ue007]/g, '');

			for (let i = 0; i < bannedWords.length; i++) {
				if (!safe(bannedWords[i].get('word'))) return;
				let regex = new RegExp(bannedWords[i].get('word'), 'g');
				censoredMessage = censoredMessage.replace(regex, '█'.repeat(bannedWords[i].get('word').length));
			}
			let Embed = this.client.util.embed()
				.setColor(message.member.displayHexColor)
				.setAuthor(message.author.username, message.author.displayAvatarURL())
				.setDescription(censoredMessage);

			message.channel.send(Embed);
			return message.delete({reason: `Deleted message: ${message.content}`});

		} else {
			/* Autoresponse feature & tag
			*
			*	This section contains autoresponse and tag feature
			*
			*/

			// auto responses
			if (message.guild) {
				const autoresponseStat = await autoResponseStat.findOne({where: {serverID: message.guild.id, stat: 'enable'}});
				if (autoresponseStat) {
					// Infinit haha very yes
					if (message.content.toLowerCase().startsWith('haha very') && message.content.toLowerCase().endsWith('yes')) {
						let yes = message.content.toLowerCase().replace('haha', '');
						yes = yes.replace('yes', '');
						yes += 'very';
						return message.channel.send(`haha${yes} yes`);
					} else if (message.content.toLowerCase() == 'haha yes') {
						return message.channel.send('haha very yes');
					}

					//  Reply with images as attachement
					const autoresponse = await autoResponse.findOne({where: {trigger: message.content.toLowerCase()}});

					if (autoresponse) {
						autoResponse.findOne({where: {trigger: message.content.toLowerCase()}});
						let trigger = autoresponse.get('trigger');
						let type = autoresponse.get('type');
						let content = autoresponse.get('response');

						if (trigger == message.content.toLowerCase() && type == 'text') {
							return message.channel.send(content);
						} else if (trigger == message.content.toLowerCase() && type == 'react') {
							return message.react(content);
						} else if (trigger == message.content.toLowerCase() && type == 'image') {
							return message.channel.send({files: [content]});
						}
					}
				}

				//  User autoresponse
				const tag = await Tag.findOne({where: {trigger: message.content.toLowerCase(), serverID: message.guild.id}});
				if (tag) {
					Tag.findOne({where: {trigger: message.content.toLowerCase(), serverID: message.guild.id}});
					let text = tag.get('response');
					if (text.includes('[ban]')) {
						message.member.ban('Tag ban :^)');
					} else if (text.includes('[kick]')) {
						message.member.kick('Tag kick :^)');
					} else if (text.includes('[delete]')) {
						message.delete();
					}

					text = rand.random(text, message);

					let attach = '';

					if (text.includes('[attach:')) {
						attach = text.split(/(\[attach:.*?])/);
						for (let i = 0, l = attach.length; i < l; i++) {
							if (attach[i].includes('[attach:')) {
								attach = attach[i].replace('[attach:', '').slice(0, -1);
								i = attach.length;
							}
						}
						text = text.replace(/(\[attach:.*?])/, '');
					}

					// THIS SECTION IS VERY VERY BAD MUST CHANGE
					if (text.includes('[embed]')) {
						text = text.replace(/\[embed\]/, ' ');

						let title = '';
						let desc = '';
						let image;
						let thumbnail;
						let footer = '';
						let color;

						if (text.includes('[embedImage:')) {
							image = text.split(/(\[embedImage:.*?])/);

							for (let i = 0, l = image.length; i < l; i++) {
								if (image[i].includes('[embedImage:')) {
									image = image[i].replace('[embedImage:', '').slice(0, -1);
									text = text.replace(/(\[embedimage:.*?])/g, '');
									i = image.length;
								}
							}
						}

						if (text.includes('[embedThumbnail:')) {
							thumbnail = text.split(/(\[embedThumbnail:.*?])/);

							for (let i = 0, l = thumbnail.length; i < l; i++) {
								if (thumbnail[i].includes('[embedThumbnail:')) {
									thumbnail = thumbnail[i].replace('[embedThumbnail:', '').slice(0, -1);
									text = text.replace(/(\[embedThumbnail:.*?])/g, '');
									i = thumbnail.length;
								}
							}
						}

						if (text.includes('[embedColor:')) {
							color = text.split(/(\[embedColor:.*?])/);
							for (let i = 0, l = color.length; i < l; i++) {
								if (color[i].includes('[embedColor:')) {
									color = color[i].replace('[embedColor:', '').slice(0, -1);
									text = text.replace(/(\[embedColor:.*?])/g, '');
									i = color.length;
								}
							}
						}


						if (text.includes('[embedTitle:')) {
							title = text.split(/(\[embedTitle:.*?])/);
							for (let i = 0, l = title.length; i < l; i++) {
								if (title[i].includes('[embedTitle:')) {
									title = title[i].replace('[embedTitle:', '').slice(0, -1);
									text = text.replace(/(\[embedTitle:.*?])/g, '');
									i = title.length;
								}
							}
						}

						if (text.includes('[embedFooter:')) {
							footer = text.split(/(\[embedFooter:.*?])/);
							for (let i = 0, l = footer.length; i < l; i++) {
								if (footer[i].includes('[embedFooter:')) {
									footer = footer[i].replace('[embedFooter:', '').slice(0, -1);
									text = text.replace(/(\[embedFooter:.*?])/g, '');
									i = footer.length;
								}
							}
						}

						if (text.includes('[embedDesc:')) {
							desc = text.split(/(\[embedDesc:.*?])/);
							for (let i = 0, l = desc.length; i < l; i++) {
								if (desc[i].includes('[embedDesc:')) {
									desc = desc[i].replace('[embedDesc:', '').slice(0, -1);
									i = desc.length;
								}
							}
						}

						const embed = this.client.util.embed()
							.setColor(color)
							.setTitle(title)
							.setImage(image)
							.setThumbnail(thumbnail)
							.setDescription(desc)
							.setFooter(footer)
							.setTimestamp();


						if (attach) {
							return message.channel.send(embed, {files: [attach]});
						} else {
							return message.channel.send(embed);

						}

					}
					if (attach) {
						return message.channel.send(text, {files: [attach]});
					} else {
						return message.channel.send(text);
					}

				}

				/*	Quotation feature
				*
				*	This section will contain the code for the quotation feature, it will detect link for it and send it as embed
				*
				*/
				const quotationstat = await quotationStat.findOne({where: {serverID: message.guild.id, stat: 'enable'}});

				if (quotationstat && (message.content.includes('discordapp.com/channels/') || message.content.includes('discord.com/channels/'))) {
					let url = message.content.split('/');
					let guildID = url[4];
					let channelID = url[5];
					let messageID = url[6].split(' ')[0];


					// Verify if the guild, channel and message exist
					let guild = this.client.guilds.resolve(guildID);
					if (!guild) return;
					let channel = this.client.channels.resolve(channelID);
					if (!channel) return;
					let quote = await channel.messages.fetch(messageID)
						.catch(() => {
							return;
						});
					if (!quote) return;

					let Embed = this.client.util.embed()
						.setAuthor(quote.author.username, quote.author.displayAvatarURL())
						.setColor(message.member ? message.member.displayHexColor : 'NAVY')
						.addField('Jump to', `[message](https://discordapp.com/channels/${message.guild.id}/${channelID}/${messageID})`, true)
						.addField('In channel', quote.channel.name, true)
						.addField('Quoted by', message.author, true)
						.setDescription(quote.content)
						.setTimestamp(quote.createdTimestamp);

					if (quote.member) Embed.setAuthor(`${quote.author.username}#${quote.author.discriminator}`, quote.author.displayAvatarURL());

					if (quote.author.bot) Embed.setAuthor(`${quote.author.username}#${quote.author.discriminator} (bot)`, quote.author.displayAvatarURL());

					if (guild.id != message.guild.id) Embed.addField('In guild', guild.name, true);
					let Attachment = (quote.attachments).array();
					if (Attachment[0]) Embed.setImage(Attachment[0].url);

					return message.channel.send(Embed);
				}
			}
		}
	}
}

module.exports = messageListener;