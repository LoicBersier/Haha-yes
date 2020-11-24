const { Listener } = require('discord-akairo');
const fs = require('fs');
let messageID = require('../../json/messageID.json'); // Save messages that entered starboard so we can edit/remove the embed


class MessageReactionAddListener extends Listener {
	constructor() {
		super('messagereactionadd', {
			emitter: 'client',
			event: 'messageReactionAdd'
		});
	}

	async exec(reaction) {
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

		await reaction.message.guild.members.fetch();

		let starboardChannel, shameboardChannel;
		let reactionCount = reaction.count;

		// If one of the reaction is the author of the message remove 1 to the reaction count
		reaction.users.cache.forEach(user => {
			if (reaction.message.author == user) reactionCount--;
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

			if (reaction.emoji == staremote || reaction.emoji.name == staremote) {
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
			if (reaction.message.guild.emojis.resolve(shameemote.replace(/\D/g,''))) {
				shameemote = reaction.message.guild.emojis.resolve(shameemote.replace(/\D/g,''));
			}

			if (reaction.emoji == shameemote || reaction.emoji.name == shameemote) {
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
				.setColor(reaction.message.member ? reaction.message.member.displayHexColor : 'NAVY')
				.setAuthor(reaction.message.author.username, reaction.message.author.displayAvatarURL())
				.addField('Jump to', `[message](https://discordapp.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id})`, true)
				.addField('Channel', reaction.message.channel, true)
				.setDescription(description)
				.setFooter(`${emote} ${reactionCount}`)
				.setTimestamp();

			if (reaction.message.guild.emojis.resolve(emote)) Embed.setFooter(reactionCount, reaction.message.guild.emojis.resolve(emote).url);

			message.edit({ embed: Embed });
		}

		async function sendEmbed(name, emote, client) {
			let messageAttachments = reaction.message.attachments.map(u=> u.url)[0];
			// Should change this so it automatically pic the channel ( I'm lazy right now )
			let channel;
			if (name == 'starboard') {
				channel = client.channels.resolve(starboardChannel.starboard);
			} else {
				channel = client.channels.resolve(shameboardChannel.shameboard);
			}

			let Embed = client.util.embed()
				.setColor(reaction.message.member ? reaction.message.member.displayHexColor : 'NAVY')
				.setAuthor(reaction.message.author.username, reaction.message.author.displayAvatarURL())
				.addField('Jump to', `[message](https://discordapp.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id})`, true)
				.addField('Channel', reaction.message.channel, true)
				.setFooter(`${emote} ${reactionCount}`)
				.setTimestamp();

			if (reaction.message.guild.emojis.resolve(emote)) Embed.setFooter(reactionCount, reaction.message.guild.emojis.resolve(emote).url);

			let description = '';

			if (reaction.message.embeds[0]) {
				if (reaction.message.embeds[0].type == 'image') {
					messageAttachments = reaction.message.embeds[0].url;
				}

				if (reaction.message.embeds[0].description) {
					description = reaction.message.embeds[0].description;
				} else if (reaction.message.content) {
					description = reaction.message.content;
				}
			} else if (reaction.message.content) {
				description = reaction.message.content;
			}

			// if message come from nsfw channel and the star/shameboard channel isn't nsfw put it in spoiler
			if (reaction.message.channel.nsfw && !channel.nsfw) {
				Embed.setDescription(`||${description}||`);
				if (messageAttachments != '') {
					let message = await channel.send(`||${messageAttachments}||`, { embed: Embed });
					messageID[reaction.message.id] = message.id;
				} else {
					let message = await channel.send({embed: Embed});
					messageID[reaction.message.id] = message.id;
				}
			} else {
				Embed.setDescription(description);
				let message = await channel.send({ files: [messageAttachments], embed: Embed })
					.catch(async () =>  channel.send(messageAttachments, { embed: Embed }));
				messageID[reaction.message.id] = message.id;
			}
		}
	}
}

module.exports = MessageReactionAddListener;