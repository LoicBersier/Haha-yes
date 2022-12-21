/* TODO:
 * Make this shit work.
*/

import { ApplicationCommandOptionType, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import db from '../../models/index.js';
import { rand } from '../../utils/rand.js';
import ratelimiter from '../../utils/ratelimiter.js';

const { ownerId, prefix } = process.env;
const prefixs = prefix.split(',');

export default {
	name: 'messageCreate',
	async execute(message, client) {
		if (message.partials) {
			await message.fetch();
		}

		if (message.author.bot) return;

		/* Autoresponse feature & tag
		 *
		 *	This section contains autoresponse and tag feature
		 *
		 */

		// auto responses
		if (message.guild) {
			const autoresponseStat = await db.autoresponseStat.findOne({ where: { serverID: message.guild.id, stat: 'enable' } });
			if (autoresponseStat) {
				// Infinite haha very yes
				if (message.content.toLowerCase().startsWith('haha very') && message.content.toLowerCase().endsWith('yes')) {
					let yes = message.content.toLowerCase().replace('haha', '');
					yes = yes.replace('yes', '');
					yes += 'very';
					return message.channel.send(`haha${yes} yes`);
				}
				else if (message.content.toLowerCase() == 'haha yes') {
					return message.channel.send('haha very yes');
				}

				//  Reply with images as attachement
				const autoresponse = await db.autoresponse.findOne({ where: { trigger: message.content.toLowerCase() } });

				if (autoresponse) {
					db.autoresponse.findOne({ where: { trigger: message.content.toLowerCase() } });
					const trigger = autoresponse.get('trigger');
					const type = autoresponse.get('type');
					const content = autoresponse.get('response');

					if (trigger == message.content.toLowerCase() && type == 'text') {
						return message.channel.send(content);
					}
					else if (trigger == message.content.toLowerCase() && type == 'react') {
						return message.react(content);
					}
					else if (trigger == message.content.toLowerCase() && type == 'image') {
						return message.channel.send({ files: [content] });
					}
				}
			}

			//  User autoresponse
			const tag = await db.Tag.findOne({ where: { trigger: message.content.toLowerCase(), serverID: message.guild.id } });
			if (tag) {
				db.Tag.findOne({ where: { trigger: message.content.toLowerCase(), serverID: message.guild.id } });
				let text = tag.get('response');
				if (text.includes('[ban]')) {
					message.member.ban('Tag ban :^)');
				}
				else if (text.includes('[kick]')) {
					message.member.kick('Tag kick :^)');
				}
				else if (text.includes('[delete]')) {
					message.delete();
				}

				text = rand(text, message);

				let attach = '';

				if (text.includes('[attach:')) {
					attach = text.split(/(\[attach:.*?])/);
					for (let i = 0, l = attach.length; i < l; i++) {
						if (attach[i].includes('[attach:')) {
							attach = attach[i].replace('[attach:', '').slice(0, -1);
							i = attach.length;
						}
					}
					text = text.replace(/(\[attach:.*?])/, '');
				}

				// THIS SECTION IS VERY VERY BAD MUST CHANGE
				if (text.includes('[embed]')) {
					text = text.replace(/\[embed\]/, ' ');

					let title = '';
					let desc = '';
					let image;
					let thumbnail;
					let footer = '';
					let color;

					if (text.includes('[embedImage:')) {
						image = text.split(/(\[embedImage:.*?])/);

						for (let i = 0, l = image.length; i < l; i++) {
							if (image[i].includes('[embedImage:')) {
								image = image[i].replace('[embedImage:', '').slice(0, -1);
								text = text.replace(/(\[embedimage:.*?])/g, '');
								i = image.length;
							}
						}
					}

					if (text.includes('[embedThumbnail:')) {
						thumbnail = text.split(/(\[embedThumbnail:.*?])/);

						for (let i = 0, l = thumbnail.length; i < l; i++) {
							if (thumbnail[i].includes('[embedThumbnail:')) {
								thumbnail = thumbnail[i].replace('[embedThumbnail:', '').slice(0, -1);
								text = text.replace(/(\[embedThumbnail:.*?])/g, '');
								i = thumbnail.length;
							}
						}
					}

					if (text.includes('[embedColor:')) {
						color = text.split(/(\[embedColor:.*?])/);
						for (let i = 0, l = color.length; i < l; i++) {
							if (color[i].includes('[embedColor:')) {
								color = color[i].replace('[embedColor:', '').slice(0, -1);
								text = text.replace(/(\[embedColor:.*?])/g, '');
								i = color.length;
							}
						}
					}


					if (text.includes('[embedTitle:')) {
						title = text.split(/(\[embedTitle:.*?])/);
						for (let i = 0, l = title.length; i < l; i++) {
							if (title[i].includes('[embedTitle:')) {
								title = title[i].replace('[embedTitle:', '').slice(0, -1);
								text = text.replace(/(\[embedTitle:.*?])/g, '');
								i = title.length;
							}
						}
					}

					if (text.includes('[embedFooter:')) {
						footer = text.split(/(\[embedFooter:.*?])/);
						for (let i = 0, l = footer.length; i < l; i++) {
							if (footer[i].includes('[embedFooter:')) {
								footer = footer[i].replace('[embedFooter:', '').slice(0, -1);
								text = text.replace(/(\[embedFooter:.*?])/g, '');
								i = footer.length;
							}
						}
					}

					if (text.includes('[embedDesc:')) {
						desc = text.split(/(\[embedDesc:.*?])/);
						for (let i = 0, l = desc.length; i < l; i++) {
							if (desc[i].includes('[embedDesc:')) {
								desc = desc[i].replace('[embedDesc:', '').slice(0, -1);
								i = desc.length;
							}
						}
					}

					const embed = new EmbedBuilder()
						.setColor(color)
						.setTitle(title)
						.setImage(image)
						.setThumbnail(thumbnail)
						.setDescription(desc)
						.setFooter(footer)
						.setTimestamp();


					if (attach) {
						return message.channel.send(embed, { files: [attach] });
					}
					else {
						return message.channel.send(embed);

					}

				}
				if (attach) {
					return message.channel.send(text, { files: [attach] });
				}
				else {
					return message.channel.send(text);
				}

			}

			/*	Quotation feature
				*
				*	This section will contain the code for the quotation feature, it will detect link for it and send it as embed
				*
				*/
			const isOptOut = await db.optout.findOne({ where: { userID: message.author.id } });
			if (!isOptOut) {
				const quotationstat = await db.quotationStat.findOne({ where: { serverID: message.guild.id, stat: 'enable' } });

				if (quotationstat && (message.content.includes('discordapp.com/channels/') || message.content.includes('discord.com/channels/'))) {
					const url = message.content.split('/');
					const guildID = url[4];
					const channelID = url[5];
					const messageID = url[6].split(' ')[0];


					// Verify if the guild, channel and message exist
					const guild = client.guilds.resolve(guildID);
					if (!guild) return;
					const channel = client.channels.resolve(channelID);
					if (!channel) return;
					const quote = await channel.messages.fetch(messageID)
						.catch(() => {
							return;
						});
					if (!quote) return;

					const Embed = new EmbedBuilder()
						.setAuthor({ name: quote.author.username, iconURL: quote.author.displayAvatarURL() })
						.setColor(message.member ? message.member.displayHexColor : 'Navy')
						.addFields(
							{ name: 'Jump to', value: `[message](https://discordapp.com/channels/${message.guild.id}/${channelID}/${messageID})`, inline: true },
							{ name: 'In channel', value: quote.channel.name.toString(), inline: true },
							{ name: 'Quoted by', value: message.author.toString(), inline: true },
						)
						.setDescription(quote.content)
						.setTimestamp(quote.createdTimestamp);

					if (quote.member) Embed.setAuthor({ name: `${quote.author.username}#${quote.author.discriminator}`, iconURL: quote.author.displayAvatarURL() });

					if (quote.author.bot) Embed.setAuthor({ name: `${quote.author.username}#${quote.author.discriminator} (BOT)`, iconURL: quote.author.displayAvatarURL() });

					if (guild.id != message.guild.id) Embed.addFields({ name: 'In guild', value: guild.name, inline: true });
					const Attachment = Array.from(message.attachments.values());
					if (Attachment[0]) Embed.setImage(Attachment[0].url);

					return message.channel.send({ embeds: [Embed] });
				}
			}
		}

		// Command handling from message

		let hasPrefix = false;
		prefixs.forEach(p => {
			if (message.content.toLowerCase().startsWith(p)) {
				hasPrefix = true;
			}
		});

		if (!hasPrefix) return;

		const messageArray = message.content.match(/"[^"]*"|\S+/g).map(m => m.slice(0, 1) === '"' ? m.slice(1, -1) : m);
		let commandName = messageArray[1].toLowerCase();
		const messageArgs = messageArray.splice(2, messageArray.length);

		// Search for alias
		client.commands.find(c => {
			if (c.alias) {
				if (c.alias.includes(commandName)) {
					commandName = c.data.name;
				}
			}
		});

		const command = client.commands.get(commandName);

		if (!command) return;

		const globalBlacklist = await db.Blacklists.findOne({ where: { type:'global', uid:message.author.id } });
		const commandBlacklist = await db.Blacklists.findOne({ where: { type:commandName, uid:message.author.id } });

		if (globalBlacklist) {
			return message.reply({ content: `You are globally blacklisted for the following reason: \`${globalBlacklist.reason}\``, ephemeral: true });
		}
		else if (commandBlacklist) {
			return message.reply({ content: `You are blacklisted for the following reason: \`${commandBlacklist.reason}\``, ephemeral: true });
		}

		const userTag = message.author.tag;
		const userID = message.author.id;

		console.log(`\x1b[33m${userTag} (${userID})\x1b[0m launched command \x1b[33m${commandName}\x1b[0m with prefix`);

		// Owner only check
		if (command.ownerOnly && message.author.id !== ownerId) {
			return message.reply({ content: '❌ This command is reserved for the owner!', ephemeral: true });
		}

		// Check if the bot has the needed permissions
		if (command.clientPermissions) {
			const clientMember = await message.guild.members.fetch(client.user.id);
			if (!clientMember.permissions.has(command.clientPermissions)) {
				return message.reply({ content: `❌ I am missing one of the following permission(s): \`${new PermissionFlagsBits(command.clientPermissions).toArray()}\``, ephemeral: true });
			}
		}

		// Check if the user has the needed permissions
		if (command.default_member_permissions) {
			if (!message.member.permissions.has(command.default_member_permissions)) {
				return message.reply({ content: `❌ You are missing one of the following permission(s): \`${new PermissionFlagsBits(command.userPermissions).toArray()}\``, ephemeral: true });
			}
		}

		// Check the ratelimit
		const doRateLimit = ratelimiter.check(message.author, commandName, command);
		if (doRateLimit) {
			return message.reply({ content: doRateLimit, ephemeral: true });

		}

		try {
			message.user = message.author;
			message.isMessage = true;
			message.prefix = `${messageArray[0]} `;

			let waitingmsg;
			const toDelete = [];
			message.deferReply = async function() {
				waitingmsg = await message.reply('The bot is thinking...');
			};
			message.followUp = async function(payload) {
				if (payload.ephemeral) {
					toDelete.push(await message.channel.send(payload));
				}
				else {
					await message.channel.send(payload);
				}
			};
			message.editReply = async function(payload) {
				if (waitingmsg) {
					await waitingmsg.delete();
				}
				await message.channel.send(payload);
			};
			message.deleteReply = async function() {
				if (waitingmsg) {
					await waitingmsg.delete()
						.catch(() => { return; });
				}
			};
			message.cleanUp = async function() {
				toDelete.forEach(async msg => {
					msg.delete();
				});
			};

			const args = {};

			let argsToDelete = 0;
			command.data.options.forEach(obj => {
				if (obj.type === ApplicationCommandOptionType.Attachment) {
					args[obj.name] = message.attachments.first();
					delete command.data.options[command.data.options.indexOf(obj)];
					argsToDelete++;
				}
			});

			const argsLength = command.data.options.length - argsToDelete;

			for (let i = 0, j = 0; i < argsLength; i++, j++) {
				if (!messageArgs[i]) continue;
				const arg = command.data.options[j];

				if (arg.type === ApplicationCommandOptionType.Attachment) continue;

				let payloadName = arg.name;
				let payload = messageArgs[i];

				if (i >= argsLength - 1) {
					payload = messageArgs.slice(i).join(' ');
				}

				if (messageArgs[i].startsWith('--')) {
					payloadName = payload.substring(2);
					payload = true;
					j--;
				}

				if (arg.type === ApplicationCommandOptionType.Mentionable) {
					await message.guild.members.fetch();
					payload = message.mentions.members.first() ? message.mentions.members.first() : message.guild.members.cache.find(u => u.user.username.toLowerCase().includes(payload.toLowerCase()));
				}

				args[payloadName] = payload;
			}
			await command.execute(message, args, client);
		}
		catch (error) {
			console.error(error);
			await message.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	},
};
