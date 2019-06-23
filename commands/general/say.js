const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const rand = require('../../rand.js');

class SayCommand extends Command {
	constructor() {
		super('say', {
			aliases: ['say'],
			category: 'general',
			args: [
				{
					id: 'text',
					type: 'string',
					prompt: {
						start: 'Write something so i can say it back',
					},
					match: 'rest'
				}
			],
			description: {
				content: 'Repeat what you say, [Click here to see the complete list of "tag"](https://cdn.discordapp.com/attachments/502198809355354133/561043193949585418/unknown.png)',
				usage: '[text]',
				examples: ['[member] is a big [adverbs] [verbs]']
			}
		});
	}

	async exec(message, args) {
		let text = args.text;
		if (!text)
			return;

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

		//	  Send the final text
		if (attach) {
			return message.channel.send(text, {files: [attach]});
		} else {
			return message.channel.send(text);
		}
	}
}

module.exports = SayCommand;