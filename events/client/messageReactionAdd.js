import { EmbedBuilder } from 'discord.js';
import fs from 'node:fs';
import db from '../../models/index.js';
global.boards = {};

export default {
	name: 'messageReactionAdd',
	async execute(reaction, users, c) {
		if (reaction.partial) {
			await reaction.fetch()
				.catch(err => {
					return console.error(err);
				});
		}

		if (reaction.message.partial) {
			await reaction.message.fetch()
				.catch(err => {
					return console.error(err);
				});
		}

		const isOptOut = await db.optout.findOne({ where: { userID: reaction.message.author } });
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

			if (reaction.emoji == staremote || reaction.emoji.name == staremote) {
				if (global.boards[reaction.message.id] && reactionCount > starcount) {
					return editEmbed('starboard', staremote, global.boards[reaction.message.id], c);
				}
				else if (reactionCount == starcount) {
					return sendEmbed('starboard', staremote, c);
				}
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

			if (reaction.emoji == shameemote || reaction.emoji.name == shameemote) {
				if (global.boards[reaction.message.id] && reactionCount > shamecount) {
					return editEmbed('shameboard', shameemote, global.boards[reaction.message.id], c);
				}
				else if (reactionCount == shamecount) {
					return sendEmbed('shameboard', shameemote, c);
				}
			}
		}

		async function editEmbed(name, emote, boardID, client) {
			let channel;
			if (name == 'starboard') {
				channel = client.channels.resolve(starboardChannel.starboard);
			}
			else {
				channel = client.channels.resolve(shameboardChannel.shameboard);
			}

			const message = await channel.messages.resolve(boardID);

			// If the message doesn't have embeds assume it got deleted so don't do anything
			if (!message) return;

			// If the original embed description is empty make this embed empty ( and not undefined )
			let description = message.embeds[0].description;
			if (!message.embeds[0].description || message.embeds[0].description == undefined) {
				description = '';
			}

			const Embed = new EmbedBuilder()
				.setColor(reaction.message.member ? reaction.message.member.displayHexColor : 'NAVY')
				.setAuthor({ name: reaction.message.author.username, iconURL: reaction.message.author.displayAvatarURL() })
				.addFields(
					{ name: 'Jump to', value: `[message](https://discordapp.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id})`, inline: true },
					{ name: 'Channel', value: reaction.message.channel.toString(), inline: true },
				)
				.setDescription(description)
				.setFooter({ text: `${emote} ${reactionCount}` })
				.setTimestamp();

			if (reaction.message.guild.emojis.resolve(emote)) Embed.setFooter(reactionCount, reaction.message.guild.emojis.resolve(emote).url);

			message.edit({ embed: Embed });
		}

		async function sendEmbed(name, emote, client) {
			let messageAttachments = reaction.message.attachments.map(u => u.url)[0];
			// Should change this so it automatically pic the channel ( I'm lazy right now )
			let channel;
			if (name == 'starboard') {
				channel = client.channels.resolve(starboardChannel.starboard);
			}
			else {
				channel = client.channels.resolve(shameboardChannel.shameboard);
			}

			const Embed = new EmbedBuilder()
				.setColor(reaction.message.member ? reaction.message.member.displayHexColor : 'NAVY')
				.setAuthor({ name: reaction.message.author.username, iconURL: reaction.message.author.displayAvatarURL() })
				.addFields(
					{ name: 'Jump to', value: `[message](https://discordapp.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id})`, inline: true },
					{ name: 'Channel', value: reaction.message.channel.toString(), inline: true },
				)
				.setFooter({ text: `${emote} ${reactionCount}` })
				.setTimestamp();

			if (reaction.message.guild.emojis.resolve(emote)) Embed.setFooter(reactionCount, reaction.message.guild.emojis.resolve(emote).url);

			let description = '';

			if (reaction.message.embeds[0]) {
				if (reaction.message.embeds[0].type == 'image') {
					messageAttachments = reaction.message.embeds[0].url;
				}

				if (reaction.message.embeds[0].description) {
					description = reaction.message.embeds[0].description;
				}
				else if (reaction.message.content) {
					description = reaction.message.content;
				}
			}
			else if (reaction.message.content) {
				description = reaction.message.content;
			}

			// if message come from nsfw channel and the star/shameboard channel isn't nsfw put it in spoiler
			if (reaction.message.channel.nsfw && !channel.nsfw) {
				Embed.setDescription(`||${description}||`);
				if (messageAttachments != '') {
					const message = await channel.send({ content: `||${messageAttachments}||`, embeds: [Embed] });
					global.boards[reaction.message.id] = message.id;
				}
				else {
					const message = await channel.send({ embeds: [Embed] });
					global.boards[reaction.message.id] = message.id;
				}
			}
			else {
				Embed.setDescription(description);
				const message = await channel.send({ files: [messageAttachments], embeds: [Embed] })
					.catch(async () => channel.send({ content: messageAttachments, embeds: [Embed] }));
				global.boards[reaction.message.id] = message.id;
			}
		}
	},
};