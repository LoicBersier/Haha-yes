const { Listener } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const reload = require('auto-reload');
let messageID = require('../json/starboard.json');

class MessageReactionAddListener extends Listener {
	constructor() {
		super('messagereactionadd', {
			emitter: 'client',
			event: 'messageReactionAdd'
		});
	}

	async exec(reaction) {
		let messageContent = reaction.message.content;
		let messageAttachments = reaction.message.attachments.map(u=> `${u.url}`);

		if (reaction.emoji.name === '🌟' && reaction.count === 4) {
			if (messageID.includes(reaction.message.id))
				return console.log('Message already in starboard!');

			messageID.push(reaction.message.id);

			let starboardChannel = reload(`../starboard/${reaction.message.guild.id}.json`);
			const channel = this.client.channels.get(starboardChannel['starboard']);

			const starEmbed = new MessageEmbed()
				.setColor(reaction.message.member.displayHexColor)
				.setDescription(messageContent)
				.setAuthor(reaction.message.author.username, reaction.message.author.displayAvatarURL)
				.setTimestamp();

			channel.send({ embed: starEmbed});
			return channel.send(`From: ${reaction.message.channel} ID: ${reaction.message.id} \n${messageAttachments}`);
		}
		if (reaction.emoji.name === '✡' && reaction.count === 1) {
			if (messageID.includes(reaction.message.id))
				return console.log('Message already in starboard!');

			messageID.push(reaction.message.id);

			let shameboardChannel = reload(`../starboard/${reaction.message.guild.id}.json`);
			const channel = this.client.channels.get(shameboardChannel['shameboard']);

			const shameEmbed = new MessageEmbed()
				.setColor(reaction.message.member.displayHexColor)
				.setDescription(messageContent)
				.setAuthor(reaction.message.author.username, reaction.message.author.displayAvatarURL)
				.setTimestamp();

			channel.send({ embed: shameEmbed});
			return channel.send(`From: ${reaction.message.channel} ID: ${reaction.message.id} \n${messageAttachments}`);
		}
	}
}

module.exports = MessageReactionAddListener;