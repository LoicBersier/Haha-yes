import { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionFlagsBits } from 'discord.js';
import db from '../../models/index.js';

export default {
	data: new SlashCommandBuilder()
		.setName('bye')
		.setDescription('Set a leave message')
		.addStringOption(option =>
			option.setName('message')
				.setDescription('The message you want the bot to say when someone leave in the current channel.')),
	category: 'admin',
	userPermissions: [PermissionFlagsBits.ManageChannels],
	async execute(interaction, args, client) {
		const leave = await db.leaveChannel.findOne({ where: { guildID: interaction.guild.id } });

		if (!leave && !args.message) {
			return interaction.reply({ content: 'You need a message for me to say anything!', ephemeral: true });
		}
		else if (!leave) {
			const body = { guildID: interaction.guild.id, channelID: interaction.channel.id, message: args.message };
			await db.leaveChannel.create(body);
			return interaction.reply({ content: `The leave message have been set with ${args.message}`, ephemeral: true });
		}

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

		await interaction.reply({ content: 'The server already has a message set, do you want to edit it or remove it?', components: [row], ephemeral: true });

		return listenButton(client, interaction, args, interaction.user);
	},
};

async function listenButton(client, interaction, args, user = interaction.user, originalId = interaction.id) {
	client.once('interactionCreate', async (interactionMenu) => {
		if (user !== interactionMenu.user) return listenButton(client, interaction, args, user, originalId);
		if (!interactionMenu.isButton()) return;

		await interactionMenu.update({ components: [] });

		if (interactionMenu.customId === `edit${interaction.user.id}${originalId}`) {
			if (!args.message) {
				return interaction.reply({ content: 'You need to input a message for me to edit!', ephemeral: true });
			}
			const body = { guildID: interaction.guild.id, channelID: interaction.channel.id, message: args.message };
			await db.leaveChannel.update(body, { where: { guildID: interaction.guild.id } });
			return interaction.editReply({ content: `The leave message has been set to ${args.message}`, ephemeral: true });
		}
		else if (interactionMenu.customId === `remove${interaction.user.id}${originalId}`) {
			db.leaveChannel.destroy({ where: { guildID: interaction.guild.id, channelID: interaction.channel.id } });
			return interaction.editReply({ content: 'The leave message has been deleted.', ephemeral: true });
		}
		else {
			return interaction.editReply({ content: 'Nothing has been changed.', ephemeral: true });
		}
	});
}