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

	async exec(reaction) {
		let messageContent = reaction.message.content;
		let messageAttachments = reaction.message.attachments.map(u=> `${u.url}`);

		//	Starboard
		if (reaction.emoji.name === '🌟' && reaction.count === 4) {
			if (messageID.includes(reaction.message.id))
				return console.log('Message already in starboard!');

			messageID.push(reaction.message.id);

			let starboardChannel = reload(`../../board/star${reaction.message.guild.id}.json`);
			const channel = this.client.channels.get(starboardChannel['starboard']);

			if (!messageContent)
				return channel.send(`${reaction.message.author.username}, in: ${reaction.message.channel} ID: ${reaction.message.id} \n${messageAttachments}`);

			const starEmbed = new MessageEmbed()
				.setColor(reaction.message.member.displayHexColor)
				.setDescription(messageContent)
				.setAuthor(reaction.message.author.username, reaction.message.author.displayAvatarURL())
				.setTimestamp();

			channel.send({ embed: starEmbed});
			return channel.send(`in: ${reaction.message.channel} ID: ${reaction.message.id} \n${messageAttachments}`);
		}
		//Shameboard
		if (reaction.emoji.name === '✡' && reaction.count === 4) {
			if (messageID.includes(reaction.message.id))
				return console.log('Message already in starboard!');

			messageID.push(reaction.message.id);

			let shameboardChannel = reload(`../../board/shame${reaction.message.guild.id}.json`);
			const channel = this.client.channels.get(shameboardChannel['shameboard']);

			if (!messageContent)
				return channel.send(`${reaction.message.author.username}, in: ${reaction.message.channel} ID: ${reaction.message.id} \n${messageAttachments}`);

			const shameEmbed = new MessageEmbed()
				.setColor(reaction.message.member.displayHexColor)
				.setDescription(messageContent)
				.setAuthor(reaction.message.author.username, reaction.message.author.displayAvatarURL())
				.setTimestamp();

			channel.send({ embed: shameEmbed});
			return channel.send(`in: ${reaction.message.channel} ID: ${reaction.message.id} \n${messageAttachments}`);
		}
	}
}

module.exports = MessageReactionAddListener;