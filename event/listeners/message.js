const { Listener } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const responseObject = require('../../json/reply.json');
const reactObject = require('../../json/react.json');
const imgResponseObject = require('../../json/imgreply.json');
const rand = require('../../rand.js');
const reload = require('auto-reload');

class messageListener extends Listener {
	constructor() {
		super('message', {
			emitter: 'client',
			event: 'message'
		});
	}

	async exec(message) {
		let autoresponse = reload('../../json/autoresponse.json');
		let message_content = message.content.toLowerCase();
	
		if (message.author.bot) return; {
	
			//  If autoresponse is enable send the response
			if(autoresponse[message.channel.id] == 'enable') {
			//  Reply with images as attachement
				if(imgResponseObject[message_content]) {
					message.channel.send({files: [imgResponseObject[message_content]]}); 
				} 
				//  React only to the messages
				else if(reactObject[message_content]) {
					message.react(reactObject[message_content]);
				}
				//  auto respond to messages
				else if(responseObject[message_content]) {
					message.channel.send(responseObject[message_content]);
				//  If it contain 'like if' react with 👍
				} else if (message_content.includes('like if')) {
					message.react('\u{1F44D}');
				//  If it contain 'jeff' react with a jeff emote
				} else if (message_content.includes('jeff')) {
					message.react('496028845967802378');
				}
			}
			//  User autoresponse
			let customresponse = reload(`../../tag/${message.guild.id}.json`);
			if(customresponse[message_content]) {
				let text = customresponse[message_content];
				if (text.includes('[ban]')) {
					message.member.ban('Tag ban :^)');
				} else if (text.includes('[kick]')) {
					message.member.kick('Tag kick :^)');
				}

				text = rand.random(text, message);
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
						console.log(desc);
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

					
					return message.channel.send(embed);
				}

				message.channel.send(text);
			}		
		}
	}
}

module.exports = messageListener;