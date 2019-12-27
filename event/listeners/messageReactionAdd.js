const { Listener } = require('discord-akairo');
const fs = require('fs');
let messageID = require('../../json/messageID.json'); // Save messages that ented starboard so we can edit/remove the embed


class MessageReactionAddListener extends Listener {
	constructor() {
		super('messagereactionadd', {
			emitter: 'client',
			event: 'messageReactionAdd'
		});
	}

	async exec(reaction) {
		let starboardChannel, shameboardChannel;
		let reactionCount = reaction.count;

		// If one of the reaction is the author of the message remove 1 to the reaction count
		reaction.users.forEach(user => {
			if (reaction.message.author == user) reactionCount--;
		});
		

		//	Starboard
		if (fs.existsSync(`./board/star${reaction.message.guild.id}.json`)) {
			starboardChannel = require(`../../board/star${reaction.message.guild.id}.json`);
			let staremote = starboardChannel.emote;
			let starcount = starboardChannel.count;
			delete require.cache[require.resolve(`../../board/star${reaction.message.guild.id}.json`)]; // Delete the boardChannel cache so it can reload it next time

			// Get name of the custom emoji
			if (this.client.util.resolveEmoji(staremote, reaction.message.guild.emojis)) {
				staremote = this.client.util.resolveEmoji(staremote, reaction.message.guild.emojis).name;
			}

			if (reaction.emoji.name == staremote) {
				if (messageID[reaction.message.id] && reactionCount > starcount) {
					return editEmbed('starboard', staremote, messageID[reaction.message.id], this.client);
				} else if (reactionCount == starcount) {
					return sendEmbed('starboard', staremote, this.client);
				}
			}
		}

		//Shameboard
		if (fs.existsSync(`./board/shame${reaction.message.guild.id}.json`)) {
			shameboardChannel = require(`../../board/shame${reaction.message.guild.id}.json`);
			let shameemote = shameboardChannel.emote;
			let shamecount = shameboardChannel.count;
			delete require.cache[require.resolve(`../../board/shame${reaction.message.guild.id}.json`)]; // Delete the boardChannel cache so it can reload it next time
			
			// Get name of the custom emoji
			if (this.client.util.resolveEmoji(shameemote, reaction.message.guild.emojis)) {
				shameemote = this.client.util.resolveEmoji(shameemote, reaction.message.guild.emojis).name;
			}

			if (reaction.emoji.name == shameemote) {
				if (messageID[reaction.message.id] && reactionCount > shamecount) {
					return editEmbed('shameboard', shameemote, messageID[reaction.message.id], this.client);
				} else if (reactionCount == shamecount) {
					return sendEmbed('shameboard', shameemote, this.client);
				}
			}
		}

		async function editEmbed(name, emote, boardID, client) {
			let channel;
			if (name == 'starboard') {
				channel = client.channels.get(starboardChannel.starboard);
			} else {
				channel = client.channels.get(shameboardChannel.shameboard);
			}

			let message = await channel.messages.get(boardID);

			let Embed = client.util.embed()
				.setColor(reaction.message.member.displayHexColor)
				.setAuthor(reaction.message.author.username, reaction.message.author.displayAvatarURL())
				.addField('Jump to', `[message](https://discordapp.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id})`, true)
				.addField('Channel', reaction.message.channel, true)
				.setDescription(message.embeds[0].description)
				.setFooter(reactionCount + ' ' + emote)
				.setTimestamp();

			if (reaction.message.guild.emojis.find(emoji => emoji.name === emote)) {
				Embed.setFooter(reactionCount, reaction.message.guild.emojis.find(emoji => emoji.name === emote).url);
			}

			message.edit({ embed: Embed });
		}

		async function sendEmbed(name, emote, client) {
			let messageAttachments = reaction.message.attachments.map(u=> u.url);
			// Should change this so it automatically pic the channel ( I'm lazy right now )
			let channel;
			if (name == 'starboard') {
				channel = client.channels.get(starboardChannel.starboard);
			} else {
				channel = client.channels.get(shameboardChannel.shameboard);
			}

			let Embed = client.util.embed()
				.setColor(reaction.message.member.displayHexColor)
				.setAuthor(reaction.message.author.username, reaction.message.author.displayAvatarURL())
				.addField('Jump to', `[message](https://discordapp.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id})`, true)
				.addField('Channel', reaction.message.channel, true)
				.setFooter(reactionCount + ' ' + emote)
				.setTimestamp();

			if (reaction.message.guild.emojis.find(emoji => emoji.name === emote)) {
				Embed.setFooter(reactionCount, reaction.message.guild.emojis.find(emoji => emoji.name === emote).url);
			}

			// if message come from nsfw channel and the star/shameboard channel isn't nsfw put it in spoiler
			if (reaction.message.channel.nsfw && !channel.nsfw) {
				Embed.setDescription(`||${reaction.message.content}||`);
				if (messageAttachments != '') {
					let message = await channel.send(`||${messageAttachments}||`, { embed: Embed });
					messageID[reaction.message.id] = message.id;
				}
				else {
					let message = await channel.send({embed: Embed});
					messageID[reaction.message.id] = message.id;
				}
			} else {
				Embed.setDescription(reaction.message.content);
				let message = await channel.send({ files: messageAttachments, embed: Embed })
					.catch(async () => channel.send(messageAttachments, { embed: Embed }));
				messageID[reaction.message.id] = message.id;
			}
		}
	}
}

module.exports = MessageReactionAddListener;