const { Listener } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const reload = require('auto-reload');
let messageID = require('../../json/starboard.json');

class MessageReactionAddListener extends Listener {
	constructor() {
		super('messagereactionadd', {
			emitter: 'client',
			event: 'messageReactionAdd'
		});
	}

	async exec(reaction, user) {
		if (reaction.message.author == user) return;
		let messageContent = reaction.message.content;
		let messageAttachments = reaction.message.attachments.map(u=> u.url);

		let starboardChannel;
		let staremote;
		let starcount;

		try {
			starboardChannel = reload(`../../board/star${reaction.message.guild.id}.json`);

			staremote = starboardChannel['emote'];
			starcount = starboardChannel['count'];
		} catch (err) {
			return null;
		}


		//	Starboard
		if (reaction.emoji.name == staremote && reaction.count == starcount) {
			if (messageID.includes(reaction.message.id))
				return console.log('Message already in starboard!');

			messageID.push(reaction.message.id);

			const channel = this.client.channels.get(starboardChannel['starboard']);

			if (!messageContent) {
				const starEmbed = new MessageEmbed()
				.setColor(reaction.message.member.displayHexColor)
				.setAuthor(reaction.message.author.username, reaction.message.author.displayAvatarURL())
				.setDescription(`[Jump to message](https://discordapp.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id})`)
				.setFooter(reaction.count + ' ' + staremote)
				.setTimestamp();

				return channel.send({files: messageAttachments, embed: starEmbed})
					.catch(() => channel.send(messageAttachments, { embed: starEmbed }));
			}

			const starEmbed = new MessageEmbed()
				.setColor(reaction.message.member.displayHexColor)
				.setAuthor(reaction.message.author.username, reaction.message.author.displayAvatarURL())
				.setDescription(messageContent)
				.addField('Jump to', `[message](https://discordapp.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id})`)
				.setFooter(reaction.count + ' ' + staremote)
				.setTimestamp();

			return channel.send(`in: ${reaction.message.channel}`, {files: messageAttachments, embed: starEmbed})
				.catch(() => channel.send(`${reaction.message.author.username}, in: ${reaction.message.channel}`, { embed: starEmbed}));
		}

		let shameboardChannel;
		let shameemote;
		let shamecount;
		try {
			shameboardChannel = reload(`../../board/shame${reaction.message.guild.id}.json`);

			shameemote = shameboardChannel['emote'];
			shamecount = shameboardChannel['count'];
		} catch (err) {
			return null;
		}



		//Shameboard
		if (reaction.emoji.name == shameemote && reaction.count == shamecount) {
			if (messageID.includes(reaction.message.id))
				return console.log('Message already in starboard!');

			messageID.push(reaction.message.id);

			const channel = this.client.channels.get(shameboardChannel['shameboard']);

			if (!messageContent) {
				const shameEmbed = new MessageEmbed()
				.setColor(reaction.message.member.displayHexColor)
				.setAuthor(reaction.message.author.username, reaction.message.author.displayAvatarURL())
				.setDescription(`[Jump to message](https://discordapp.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id})`)
				.setFooter(reaction.count + ' ' + shameemote)
				.setTimestamp();

				return channel.send({files: messageAttachments, embed: shameEmbed })
					.catch(() => channel.send(messageAttachments, { embed: shameEmbed}));
			}

			const shameEmbed = new MessageEmbed()
				.setColor(reaction.message.member.displayHexColor)
				.setAuthor(reaction.message.author.username, reaction.message.author.displayAvatarURL())
				.setDescription(messageContent)
				.addField('Jump to', `[message](https://discordapp.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id})`)
				.setFooter(reaction.count + ' ' + shameemote)
				.setTimestamp();

			return channel.send(`in: ${reaction.message.channel}`,{files: messageAttachments, embed: shameEmbed})
				.catch(() => channel.send(`${reaction.message.author.username}, in: ${reaction.message.channel}`, { embed: shameEmbed}));
		}
	}
}

module.exports = MessageReactionAddListener;