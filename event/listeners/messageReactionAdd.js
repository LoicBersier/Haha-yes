const { Listener } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
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
		let starboardChannel, shameboardChannel, staremote, starcount, shameemote, shamecount;
		if (fs.existsSync(`./board/star${reaction.message.guild.id}.json`)) {
			starboardChannel = require(`../../board/star${reaction.message.guild.id}.json`);
			staremote = starboardChannel['emote'];
			starcount = starboardChannel['count'];
		}
		if (fs.existsSync(`./board/shame${reaction.message.guild.id}.json`)) {
			shameboardChannel = require(`../../board/shame${reaction.message.guild.id}.json`);
			shameemote = shameboardChannel['emote'];
			shamecount = shameboardChannel['count'];
		}

		let messageContent = reaction.message.content;
		let messageAttachments = reaction.message.attachments.map(u=> u.url);

		//	Starboard
		if (reaction.emoji.name == staremote && reaction.count == starcount) {
			if (messageID.includes(reaction.message.id))
				return console.log('Message already in starboard!');

			messageID.push(reaction.message.id);

			sendEmbed('starboard', staremote, this.client);
		}

		//Shameboard
		if (reaction.emoji.name == shameemote && reaction.count == shamecount) {
			if (messageID.includes(reaction.message.id))
				return console.log('Message already in starboard!');

			messageID.push(reaction.message.id);

			sendEmbed('shameboard', shameemote, this.client);
		}

		function sendEmbed(name, emote, client) {
			let channel;
			if (name == 'starboard') {
				channel = client.channels.get(starboardChannel['starboard']);
			} else {
				channel = client.channels.get(shameboardChannel['shameboard']);
			}

			const Embed = new MessageEmbed()
				.setColor(reaction.message.member.displayHexColor)
				.setAuthor(reaction.message.author.username, reaction.message.author.displayAvatarURL())
				.setDescription(messageContent)
				.addField('Jump to', `[message](https://discordapp.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id})`, true)
				.addField('Channel', reaction.message.channel, true)
				.setFooter(reaction.count + ' ' + emote)
				.setTimestamp();

			return channel.send({files: messageAttachments, embed: Embed})
				.catch(() => channel.send(messageAttachments, { embed: Embed}));
		}
	}
}

module.exports = MessageReactionAddListener;