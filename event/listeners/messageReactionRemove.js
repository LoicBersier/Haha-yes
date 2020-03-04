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
		reaction.users.cache.forEach(user => {
			if (reaction.message.author == user) reactionCount++;
		});

		//	Starboard
		if (fs.existsSync(`./board/star${reaction.message.guild.id}.json`)) {
			starboardChannel = require(`../../board/star${reaction.message.guild.id}.json`);
			let staremote = starboardChannel.emote;
			let starcount = starboardChannel.count;
			delete require.cache[require.resolve(`../../board/star${reaction.message.guild.id}.json`)]; // Delete the boardChannel cache so it can reload it next time

			// Get name of the custom emoji
			if (reaction.message.guild.emojis.resolve(staremote.replace(/\D/g,''))) {
				staremote = reaction.message.guild.emojis.resolve(staremote.replace(/\D/g,''));
			}

			if (messageID[reaction.message.id] && (reaction.emoji == staremote || reaction.emoji.name == staremote) && reactionCount < starcount) {
				let channel = this.client.channels.resolve(starboardChannel.starboard);
				let message = await channel.messages.resolve(messageID[reaction.message.id]);
				delete messageID[reaction.message.id];
				// If it didn't find any message don't do anything
				if (!message) return;

				message.delete();
			} else if ((reaction.emoji == staremote || reaction.emoji.name == staremote) && reactionCount >= starcount) {
				return editEmbed('starboard', staremote, messageID[reaction.message.id], this.client);
			}
		}

		//Shameboard
		if (fs.existsSync(`./board/shame${reaction.message.guild.id}.json`)) {
			shameboardChannel = require(`../../board/shame${reaction.message.guild.id}.json`);
			let shameemote = shameboardChannel.emote;
			let shamecount = shameboardChannel.count;
			delete require.cache[require.resolve(`../../board/shame${reaction.message.guild.id}.json`)]; // Delete the boardChannel cache so it can reload it next time

			// Get name of the custom emoji
			if (reaction.message.guild.emojis.resolve(shameemote.replace(/\D/g,''))) {
				shameemote = reaction.message.guild.emojis.resolve(shameemote.replace(/\D/g,''));
			}

			if (messageID[reaction.message.id] && (reaction.emoji == shameemote || reaction.emoji.name == shameemote) && reactionCount < shamecount) {
				let channel = this.client.channels.resolve(shameboardChannel.shameboard);
				let message = await channel.messages.resolve(messageID[reaction.message.id]);
				delete messageID[reaction.message.id];
				message.delete();
			} else if ((reaction.emoji == shameemote || reaction.emoji.name == shameemote) && reactionCount >= shamecount) {
				return editEmbed('shameboard', shameemote, messageID[reaction.message.id], this.client);
			}
		}

		async function editEmbed(name, emote, boardID, client) {
			let channel;
			if (name == 'starboard') {
				channel = client.channels.resolve(starboardChannel.starboard);
			} else {
				channel = client.channels.resolve(shameboardChannel.shameboard);
			}

			let message = await channel.messages.resolve(boardID);

			// If the message doesn't have embeds assume it got deleted so don't do anything
			if (!message) return;

			// If the original embed description is empty make this embed empty ( and not undefined )
			let description = message.embeds[0].description;
			if (!message.embeds[0].description || message.embeds[0].description == undefined) 
				description = '';

			let Embed = client.util.embed()
				.setColor(reaction.message.member.displayHexColor)
				.setAuthor(reaction.message.author.username, reaction.message.author.displayAvatarURL())
				.addField('Jump to', `[message](https://discordapp.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id})`, true)
				.addField('Channel', reaction.message.channel, true)
				.setDescription(description)
				.setFooter(`${emote} ${reactionCount}`)
				.setTimestamp();

			if (reaction.message.guild.emojis.resolve(emote)) Embed.setFooter(reactionCount, reaction.message.guild.emojis.resolve(emote).url);

			message.edit({ embed: Embed });
		}
	}
}

module.exports = messageReactionRemoveListener;