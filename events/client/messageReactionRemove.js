import { EmbedBuilder } from 'discord.js';
import fs from 'node:fs';
import db from '../../models/index.js';

export default {
	name: 'messageReactionRemove',
	async execute(reaction, users, c) {
		if (reaction.partial) {
			await reaction.fetch()
				.catch(err => {
					return console.error(err);
				});
		}

		/* I don't really know why this is causing issues.
		if (reaction.message.partial) {
			await reaction.message.fetch()
				.catch(err => {
					return console.error(err);
				});
		}
		*/

		const isOptOut = await db.optout.findOne({ where: { userID: reaction.message.author.id } });
		if (isOptOut) return;

		let starboardChannel, shameboardChannel;
		let reactionCount = reaction.count;

		// If one of the reaction is the author of the message remove 1 to the reaction count
		reaction.users.cache.forEach(user => {
			if (reaction.message.author == user) reactionCount--;
		});

		//	Starboard
		if (fs.existsSync(`./json/board/star${reaction.message.guild.id}.json`)) {
			starboardChannel = JSON.parse(fs.readFileSync(`./json/board/star${reaction.message.guild.id}.json`));
			let staremote = starboardChannel.emote;
			const starcount = starboardChannel.count;
			// Get name of the custom emoji
			if (reaction.message.guild.emojis.resolve(staremote.replace(/\D/g, ''))) {
				staremote = reaction.message.guild.emojis.resolve(staremote.replace(/\D/g, ''));
			}

			if (global.boards[reaction.message.id] && (reaction.emoji == staremote || reaction.emoji.name == staremote) && reactionCount < starcount) {
				const channel = c.channels.resolve(starboardChannel.starboard);
				const message = await channel.messages.resolve(global.boards[reaction.message.id]);
				delete global.boards[reaction.message.id];
				// If it didn't find any message don't do anything
				if (!message) return;

				message.delete();
			}
			else if ((reaction.emoji == staremote || reaction.emoji.name == staremote) && reactionCount >= starcount) {
				return editEmbed('starboard', staremote, global.boards[reaction.message.id]);
			}
		}

		// Shameboard
		if (fs.existsSync(`./json/board/shame${reaction.message.guild.id}.json`)) {
			shameboardChannel = JSON.parse(fs.readFileSync(`./json/board/shame${reaction.message.guild.id}.json`));
			let shameemote = shameboardChannel.emote;
			const shamecount = shameboardChannel.count;
			// Get name of the custom emoji
			if (reaction.message.guild.emojis.resolve(shameemote.replace(/\D/g, ''))) {
				shameemote = reaction.message.guild.emojis.resolve(shameemote.replace(/\D/g, ''));
			}

			if (global.boards[reaction.message.id] && (reaction.emoji == shameemote || reaction.emoji.name == shameemote) && reactionCount < shamecount) {
				const channel = c.channels.resolve(starboardChannel.starboard);
				const message = await channel.messages.resolve(global.boards[reaction.message.id]);
				delete global.boards[reaction.message.id];
				// If it didn't find any message don't do anything
				if (!message) return;

				message.delete();
			}
			else if ((reaction.emoji == shameemote || reaction.emoji.name == shameemote) && reactionCount >= shamecount) {
				return editEmbed('shameboard', shameemote, global.boards[reaction.message.id]);
			}
		}

		async function editEmbed(name, emote, boardID) {
			let channel;
			if (name == 'starboard') {
				channel = c.channels.resolve(starboardChannel.starboard);
			}
			else {
				channel = c.channels.resolve(shameboardChannel.shameboard);
			}

			const message = await channel.messages.resolve(boardID);

			// If the message doesn't have embeds assume it got deleted so don't do anything
			if (!message) return;

			// If the original embed description is empty make this embed null ( and not empty )
			let description = message.embeds[0].description;
			if (!message.embeds[0].description || message.embeds[0].description == undefined) {
				description = null;
			}

			const Embed = new EmbedBuilder()
				.setColor(reaction.message.member ? reaction.message.member.displayHexColor : 'Navy')
				.setAuthor({ name: reaction.message.author.username, iconURL: reaction.message.author.displayAvatarURL() })
				.addFields(
					{ name: 'Jump to', value: `[message](https://discordapp.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id})`, inline: true },
					{ name: 'Channel', value: reaction.message.channel.toString(), inline: true },
				)
				.setDescription(description)
				.setFooter({ text: `${emote} ${reactionCount}` })
				.setTimestamp();

			if (reaction.message.guild.emojis.resolve(emote)) Embed.setFooter({ text: `${reactionCount}`, iconURL: reaction.message.guild.emojis.resolve(emote).url });

			message.edit({ embeds: [Embed] });
		}
	},
};