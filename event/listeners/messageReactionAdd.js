const { Listener } = require('discord-akairo');
const fs = require('fs');
let messageID = []; // Where reaction.message.id that entered a board will be stocked so it doesn't enter again


class MessageReactionAddListener extends Listener {
	constructor() {
		super('messagereactionadd', {
			emitter: 'client',
			event: 'messageReactionAdd'
		});
	}

	async exec(reaction, user) {
		if (reaction.message.author == user) return;
		let starboardChannel, shameboardChannel;

		if (messageID.includes(reaction.message.id)) return;

		//	Starboard
		if (fs.existsSync(`./board/star${reaction.message.guild.id}.json`)) {
			starboardChannel = require(`../../board/star${reaction.message.guild.id}.json`);
			let staremote = starboardChannel.emote;
			let starcount = starboardChannel.count;
			delete require.cache[require.resolve(`../../board/star${reaction.message.guild.id}.json`)]; // Delete the boardChannel cache so it can reload it next time

			if (this.client.util.resolveEmoji(staremote, reaction.message.guild.emojis)) {
				staremote = this.client.util.resolveEmoji(staremote, reaction.message.guild.emojis).name;
			}

			if (reaction.emoji.name == staremote && reaction.count == starcount) {
				messageID.push(reaction.message.id);
				return sendEmbed('starboard', staremote, this.client);
			}
		}

		//Shameboard
		if (fs.existsSync(`./board/shame${reaction.message.guild.id}.json`)) {
			shameboardChannel = require(`../../board/shame${reaction.message.guild.id}.json`);
			let shameemote = shameboardChannel.emote;
			let shamecount = shameboardChannel.count;
			delete require.cache[require.resolve(`../../board/shame${reaction.message.guild.id}.json`)]; // Delete the boardChannel cache so it can reload it next time


			if (reaction.emoji.name == shameemote && reaction.count == shamecount) {
				messageID.push(reaction.message.id);
				return sendEmbed('shameboard', shameemote, this.client);
			}
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
				.setFooter(reaction.count + ' ' + emote)
				.setTimestamp();

			if (reaction.message.guild.emojis.find(emoji => emoji.name === emote)) {
				Embed.setFooter(reaction.count, reaction.message.guild.emojis.find(emoji => emoji.name === emote).url);
			}

			// if message come from nsfw channel and the star/shameboard channel isn't nsfw put it in spoiler
			if (reaction.message.channel.nsfw && !channel.nsfw) {
				Embed.setDescription(`||${reaction.message.content}||`);
				if (messageAttachments != '') {
					return channel.send(`||${messageAttachments}||`, { embed: Embed });
				}
				else {
					return channel.send({embed: Embed});
				}
			} else {
				Embed.setDescription(reaction.message.content);
				return channel.send({ files: messageAttachments, embed: Embed })
					.catch(async () => channel.send(messageAttachments, { embed: Embed }));
			}
		}
	}
}

module.exports = MessageReactionAddListener;