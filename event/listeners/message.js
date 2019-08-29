const { Listener } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const rand = require('../../rand.js');
const Sequelize = require('sequelize');
const Tag = require('../../models').Tag;
const autoResponse = require('../../models').autoresponse;
const autoResponseStat = require('../../models').autoresponseStat;
const BannedWords = require('../../models').bannedWords;

class messageListener extends Listener {
	constructor() {
		super('message', {
			emitter: 'client',
			event: 'message'
		});
	}

	async exec(message) {		
		if (message.author.bot) return;


		// Banned words
		const bannedWords = await BannedWords.findAll({where: {word: Sequelize.where(Sequelize.fn('LOCATE', Sequelize.col('word'), message.content.replace(/\u200B/g, '').replace(/[\u0250-\ue007]/g, '')), Sequelize.Op.ne, 0), serverID: message.guild.id}});
		if (bannedWords[0].get('word')) {
			// Remove accent
			let censoredMessage = message.content.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
			// Remove zero width space character
			censoredMessage = censoredMessage.replace(/\u200B/g, '');
			// Remove non latin character
			censoredMessage = censoredMessage.replace(/[\u0250-\ue007]/g, '');
			
			for (let i = 0; i < bannedWords.length; i++) {
				let regex = new RegExp(bannedWords[i].get('word'), 'g');
				censoredMessage = censoredMessage.replace(regex, '█'.repeat(bannedWords[i].get('word').length));
			}
			let Embed = new MessageEmbed()
				.setColor('#FF0000')
				.setAuthor(message.author.username, message.author.displayAvatarURL())
				.setDescription(censoredMessage);

			message.channel.send(Embed);
			return message.delete({reason: `Deleted message: ${message.content}`});
		} else {
			// auto responses
			const autoresponseStat = await autoResponseStat.findOne({where: {serverID: message.guild.id}});
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

				//  If autoresponse is enable send the response
				if(autoresponseStat.get('stat') == 'enable' && autoresponseStat.get('serverID') == message.guild.id) {
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
					message.delete('Tag delete :^)');
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
		
					const embed = new MessageEmbed()
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
		}
	}
}

module.exports = messageListener;