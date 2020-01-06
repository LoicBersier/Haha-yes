const { Listener } = require('discord-akairo');
const fs = require('fs');
let messageID = require('../../json/messageID.json'); // Where reaction.message.id that entered a board will be stocked so it doesn't enter again

class messageReactionRemoveListener extends Listener {
	constructor() {
		super('messagereactionremove', {
			emitter: 'client',
			event: 'messageReactionRemove'
		});
	}

	async exec(reaction) {
		if (reaction.message.partial) {
			await reaction.message.fetch()
				.catch(() => {
					return;
				});
		}

		let starboardChannel, shameboardChannel;
		let reactionCount = reaction.count;

		// If one of the reaction removed is the author of the message add 1 to the reaction count
		reaction.users.forEach(user => {
			if (reaction.message.author == user) reactionCount++;
		});

		//	Starboard
		if (fs.existsSync(`./board/star${reaction.message.guild.id}.json`)) {
			starboardChannel = require(`../../board/star${reaction.message.guild.id}.json`);
			let staremote = starboardChannel.emote;
			let starcount = starboardChannel.count;
			delete require.cache[require.resolve(`../../board/star${reaction.message.guild.id}.json`)]; // Delete the boardChannel cache so it can reload it next time

			if (this.client.util.resolveEmoji(staremote, reaction.message.guild.emojis)) {
				staremote = this.client.util.resolveEmoji(staremote, reaction.message.guild.emojis).name;
			}

			if (messageID[reaction.message.id] && reaction.emoji.name == staremote && reactionCount < starcount) {
				let channel = this.client.channels.get(starboardChannel.starboard);
				let message = await channel.messages.get(messageID[reaction.message.id]);
				delete messageID[reaction.message.id];
				message.delete();
			} else if (reaction.emoji.name == staremote && reactionCount >= starcount) {
				return editEmbed('starboard', staremote, messageID[reaction.message.id], this.client);
			}
		}

		//Shameboard
		if (fs.existsSync(`./board/shame${reaction.message.guild.id}.json`)) {
			shameboardChannel = require(`../../board/shame${reaction.message.guild.id}.json`);
			let shameemote = shameboardChannel.emote;
			let shamecount = shameboardChannel.count;
			delete require.cache[require.resolve(`../../board/shame${reaction.message.guild.id}.json`)]; // Delete the boardChannel cache so it can reload it next time

			if (this.client.util.resolveEmoji(shameemote, reaction.message.guild.emojis)) {
				shameemote = this.client.util.resolveEmoji(shameemote, reaction.message.guild.emojis).name;
			}

			if (messageID[reaction.message.id] && reaction.emoji.name == shameemote && reactionCount < shamecount) {
				let channel = this.client.channels.get(shameboardChannel.shameboard);
				let message = await channel.messages.get(messageID[reaction.message.id]);
				delete messageID[reaction.message.id];
				message.delete();
			} else if (reaction.emoji.name == shameemote && reactionCount >= shamecount) {
				return editEmbed('shameboard', shameemote, messageID[reaction.message.id], this.client);
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
			// If the original embed description is empty make this embed empty ( and not undefined )
			let description = message.embeds[0].description;
			if (!message.embeds[0].description) 
				description = '';

			let Embed = client.util.embed()
				.setColor(reaction.message.member.displayHexColor)
				.setAuthor(reaction.message.author.username, reaction.message.author.displayAvatarURL())
				.addField('Jump to', `[message](https://discordapp.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id})`, true)
				.addField('Channel', reaction.message.channel, true)
				.setDescription(description)
				.setFooter(reactionCount + ' ' + emote)
				.setTimestamp();

			if (reaction.message.guild.emojis.find(emoji => emoji.name === emote)) {
				Embed.setFooter(reactionCount, reaction.message.guild.emojis.find(emoji => emoji.name === emote).url);
			}

			message.edit({ embed: Embed });
		}
	}
}

module.exports = messageReactionRemoveListener;