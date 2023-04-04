import { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionFlagsBits } from 'discord.js';
import os from 'node:os';
import fs from 'node:fs';

import db from '../../models/index.js';

const { ownerId } = process.env;

export default {
	data: new SlashCommandBuilder()
		.setName('tag')
		.setDescription('Create custom autoresponse')
		.addStringOption(option =>
			option.setName('trigger')
				.setDescription('The strings that will trigger the tag')
				.setRequired(false))
		.addStringOption(option =>
			option.setName('response')
				.setDescription('What it will answer back')
				.setRequired(false))
		.addBooleanOption(option =>
			option.setName('remove')
				.setDescription('(ADMIN ONLY!) Remove the tag')
				.setRequired(false))
		.addBooleanOption(option =>
			option.setName('list')
				.setDescription('List all the tags for the server')
				.setRequired(false)),
	category: 'admin',
	userPermissions: [PermissionFlagsBits.ManageChannels],
	async execute(interaction, args, client) {
		await interaction.deferReply();
		if (args.list) {
			let tagList = await db.Tag.findAll({ attributes: ['trigger', 'response', 'ownerID'], where: { serverID: interaction.guild.id } });

			if (args.trigger) {
				tagList = await db.Tag.findOne({ attributes: ['trigger', 'response', 'ownerID'], where: { trigger: args.trigger, serverID: interaction.guild.id } });
			}

			if (!tagList) return interaction.editReply('It looks like the server has no tags.');

			const path = `${os.tmpdir()}/${interaction.guild.id}.json`;
			fs.writeFile(path, JSON.stringify(tagList, null, 2), function(err) {
				if (err) return console.error(err);
			});
			return interaction.editReply({ files: [path] });
		}

		const tag = await db.Tag.findOne({ where: { trigger: args.trigger, serverID: interaction.guild.id } });

		if (args.remove) {
			if (tag) {
				if (tag.get('ownerID') == interaction.user.id || interaction.member.hasPermission('ADMINISTRATOR') || interaction.user.id == ownerId) {
					db.Tag.destroy({ where: { trigger: args.trigger, serverID: interaction.guild.id } });
					return interaction.editReply('successfully deleted the following tag: ' + args.trigger);
				}
				else {
					return interaction.editReply(`You are not the owner of this tag, if you think it is problematic ask an admin to remove it by doing ${this.client.commandHandler.prefix[0]}tag ${args.trigger} --remove`);
				}
			}
			else {
				return interaction.editReply('Did not find the specified tag, are you sure it exist?');
			}
		}

		if (!args.trigger) return interaction.editReply('You need to specify what you want me to respond to.');
		if (!args.response) return interaction.editReply('You need to specify what you want me to answer with.');

		if (!tag) {
			const body = { trigger: args.trigger, response: args.response, ownerID: interaction.user.id, serverID: interaction.guild.id };
			await db.Tag.create(body);
			return interaction.editReply(`tag have been set to ${args.trigger} : ${args.response}`);
		}
		else if (tag.get('ownerID') == interaction.user.id || interaction.member.hasPermission('ADMINISTRATOR') || interaction.user.id == ownerId) {

			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`edit${interaction.user.id}`)
						.setLabel('Edit')
						.setStyle(ButtonStyle.Primary),
				)
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`remove${interaction.user.id}`)
						.setLabel('Remove')
						.setStyle(ButtonStyle.Danger),
				)
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`nothing${interaction.user.id}`)
						.setLabel('Do nothing')
						.setStyle(ButtonStyle.Secondary),
				);

			await interaction.editReply({ content: 'This tag already exist, do you want to update it, remove it or do nothing?', components: [row], ephemeral: true });

			client.on('interactionCreate', async (interactionMenu) => {
				if (interaction.user !== interactionMenu.user) return;
				if (!interactionMenu.isButton) return;
				interactionMenu.update({ components: [] });
				if (interactionMenu.customId === `edit${interaction.user.id}`) {
					const body = { trigger: args.trigger, response: args.response, ownerID: interaction.user.id, serverID: interaction.guild.id };
					await db.joinChannel.update(body, { where: { guildID: interaction.guild.id } });
					return interaction.editReply({ content: `The tag ${args.trigger} has been set to ${args.response}`, ephemeral: true });
				}
				else if (interactionMenu.customId === `remove${interaction.user.id}`) {
					db.Tag.destroy({ where: { trigger: args.trigger, serverID: interaction.guild.id } });
					return interaction.editReply({ content: `The tag ${args.trigger} has been deleted`, ephemeral: true });
				}
				else {
					return interaction.editReply({ content: 'Nothing has been changed.', ephemeral: true });
				}
			});

			/*
			const filter = m => m.content && m.author.id == interaction.user.id;
			message.channel.awaitMessages(filter, { time: 5000, max: 1, errors: ['time'] })
				.then(async messages => {
					let messageContent = messages.map(messages => messages.content.toLowerCase());
					if (messageContent[0] === 'y' || messageContent[0] === 'yes') {
						const body = { trigger: args.trigger, response: args.response, ownerID: interaction.user.id, serverID: message.guild.id };
						await Tag.update(body, { where: { trigger: args.trigger, serverID: message.guild.id } });
						return interaction.editReply(`tag have been set to ${args.trigger} : ${args.response}`);
					}
					else {
						return interaction.editReply('Not updating.');
					}
				})
				.catch(err => {
					console.error(err);
					return interaction.editReply('Took too long to answer. didin\'t update anything.');
				});
                */
		}
		else {
			return interaction.editReply(`You are not the owner of this tag, if you think it is problematic ask an admin to remove it by doing ${this.client.commandHandler.prefix[0]}tag ${args.trigger} --remove`);
		}

		const join = await db.joinChannel.findOne({ where: { guildID: interaction.guild.id } });

		if (!join && !args.message) {
			return interaction.editReply({ content: 'You need a message for me to say anything!', ephemeral: true });
		}
		else if (!join) {
			const body = { guildID: interaction.guild.id, channelID: interaction.channel.id, message: args.message };
			await db.joinChannel.create(body);
			return interaction.editReply({ content: `The join message have been set with ${args.message}`, ephemeral: true });
		}
	},
};


/*
const { Command } = require('discord-akairo');
const Tag = require('../../models').Tag;

class TagCommand extends Command {
	constructor() {
		super('tag', {
			aliases: ['tag'],
			category: 'admin',
			userPermissions: ['MANAGE_MESSAGES'],
			args: [
				{
					id: 'trigger',
					type: 'string',
				},
				{
					id: 'remove',
					match: 'flag',
					flag: '--remove'
				},
				{
					id: 'reset',
					match: 'flag',
					flag: '--reset'
				},
				{
					id: 'response',
					type: 'string',
					match: 'rest',
				}
			],
			channel: 'guild',
			description: {
				content: 'Create custom autoresponse (--remove to delete a tag, --reset to delete EVERY tag on the server)  [Click here to see the complete list of "tag"](https://cdn.discordapp.com/attachments/502198809355354133/561043193949585418/unknown.png) (Need "" if the trigger contains spaces)',
				usage: '[trigger] [response]',
				examples: ['"do you know da wea" Fuck off dead meme', 'hello Hello [author], how are you today?', 'hello --remove']
			}
		});
	}

	async exec(message, args) {
		const tag = await Tag.findOne({where: {trigger: args.trigger, serverID: message.guild.id}});
		const ownerID = this.client.ownerID;

		if (args.reset) {
			if (message.member.hasPermission('ADMINISTRATOR')) {
				interaction.editReply('Are you sure you want to delete EVERY tag? There is no way to recover them. y/n');

				const filter = m =>  m.content && m.author.id == interaction.user.id;
				return message.channel.awaitMessages(filter, {time: 5000, max: 1, errors: ['time'] })
					.then(async messages => {
						let messageContent = messages.map(messages => messages.content.toLowerCase());
						if (messageContent[0] === 'y' || messageContent[0] === 'yes') {
							Tag.destroy({where: {serverID: message.guild.id}});
							return interaction.editReply('Tags have been reset.');
						} else {
							return interaction.editReply('Not reseting.');
						}
					})
					.catch(err => {
						console.error(err);
						return interaction.editReply('Took too long to answer. didin\'t update anything.');
					});
			} else {
				return interaction.editReply('Only person with the `ADMINISTRATOR` rank can reset tags.');
			}
		}

		if (args.remove) {
			if (tag) {
				if (tag.get('ownerID') == interaction.user.id || message.member.hasPermission('ADMINISTRATOR') || interaction.user.id == ownerID) {
					Tag.destroy({where: {trigger: args.trigger, serverID: message.guild.id}});
					return interaction.editReply('successfully deleted the following tag: ' + args.trigger);
				} else {
					return interaction.editReply(`You are not the owner of this tag, if you think it is problematic ask an admin to remove it by doing ${this.client.commandHandler.prefix[0]}tag ${args.trigger} --remove`);
				}
			} else {
				return interaction.editReply('Did not find the specified tag, are you sure it exist?');
			}
		}


		if (!args.trigger) return interaction.editReply('Please provide a trigger in order to create a tag.');

		if (!args.response) return interaction.editReply('Please provide the response for that tag');

		if (!tag) {
			const body = {trigger: args.trigger, response: args.response, ownerID: interaction.user.id, serverID: message.guild.id};
			await Tag.create(body);
			return interaction.editReply(`tag have been set to ${args.trigger} : ${args.response}`);
		} else if (tag.get('ownerID') == interaction.user.id || message.member.hasPermission('ADMINISTRATOR') || interaction.user.id == ownerID) {
			interaction.editReply('This tag already exist, do you want to update it? y/n');
			const filter = m =>  m.content && m.author.id == interaction.user.id;
			message.channel.awaitMessages(filter, {time: 5000, max: 1, errors: ['time'] })
				.then(async messages => {
					let messageContent = messages.map(messages => messages.content.toLowerCase());
					if (messageContent[0] === 'y' || messageContent[0] === 'yes') {
						const body = {trigger: args.trigger, response: args.response, ownerID: interaction.user.id, serverID: message.guild.id};
						await Tag.update(body, {where: {trigger: args.trigger, serverID: message.guild.id}});
						return interaction.editReply(`tag have been set to ${args.trigger} : ${args.response}`);
					} else {
						return interaction.editReply('Not updating.');
					}
				})
				.catch(err => {
					console.error(err);
					return interaction.editReply('Took too long to answer. didin\'t update anything.');
				});
		} else {
			return interaction.editReply(`You are not the owner of this tag, if you think it is problematic ask an admin to remove it by doing ${this.client.commandHandler.prefix[0]}tag ${args.trigger} --remove`);
		}
	}
}

module.exports = TagCommand;
*/