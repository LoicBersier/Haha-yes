import { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionFlagsBits, PermissionsBitField } from 'discord.js';
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
				if (tag.get('ownerID') == interaction.user.id || interaction.member.permissionsIn(interaction.channel).has(PermissionsBitField.Flags.Administrator) || interaction.user.id == ownerId) {
					db.Tag.destroy({ where: { trigger: args.trigger, serverID: interaction.guild.id } });
					return interaction.editReply('successfully deleted the following tag: ' + args.trigger);
				}
				else {
					return interaction.editReply(`You are not the owner of this tag, if you think it is problematic ask a user with the 'Administrator' permission to remove it by doing ${this.client.commandHandler.prefix[0]}tag ${args.trigger} --remove`);
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
		else if (tag.get('ownerID') == interaction.user.id || interaction.member.permissionsIn(interaction.channel).has('ADMINISTRATOR') || interaction.user.id == ownerId) {

			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`edit${interaction.user.id}${interaction.id}`)
						.setLabel('Edit')
						.setStyle(ButtonStyle.Primary),
				)
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`remove${interaction.user.id}${interaction.id}`)
						.setLabel('Remove')
						.setStyle(ButtonStyle.Danger),
				)
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`nothing${interaction.user.id}${interaction.id}`)
						.setLabel('Do nothing')
						.setStyle(ButtonStyle.Secondary),
				);

			await interaction.editReply({ content: 'This tag already exist, do you want to update it, remove it or do nothing?', components: [row], ephemeral: true });

			return listenButton(client, interaction, args, interaction.user);
		}
		else {
			return interaction.editReply(`You are not the owner of this tag, if you think it is problematic ask an admin to remove it by doing ${this.client.commandHandler.prefix[0]}tag ${args.trigger} --remove`);
		}
	},
};

async function listenButton(client, interaction, args, user = interaction.user, originalId = interaction.id) {
	client.once('interactionCreate', async (interactionMenu) => {
		if (user !== interactionMenu.user) return listenButton(client, interaction, args, user, originalId);
		if (!interactionMenu.isButton()) return;

		await interactionMenu.update({ components: [] });

		if (interactionMenu.customId === `edit${interaction.user.id}${originalId}`) {
			const body = { trigger: args.trigger, response: args.response, ownerID: interaction.user.id, serverID: interaction.guild.id };
			db.Tag.update(body, { where: { serverID: interaction.guild.id } });
			return interaction.editReply({ content: `The tag ${args.trigger} has been set to ${args.response}`, ephemeral: true });
		}
		else if (interactionMenu.customId === `remove${interaction.user.id}${originalId}`) {
			db.Tag.destroy({ where: { trigger: args.trigger, serverID: interaction.guild.id } });
			return interaction.editReply({ content: `The tag ${args.trigger} has been deleted`, ephemeral: true });
		}
		else {
			return interaction.editReply({ content: 'Nothing has been changed.', ephemeral: true });
		}
	});
}