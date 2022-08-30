import { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionFlagsBits } from 'discord.js';
import db from '../../models/index.js';

export default {
	data: new SlashCommandBuilder()
		.setName('autoresponse')
		.setDescription('Enable or disable autoresponse'),
	category: 'admin',
	userPermissions: [PermissionFlagsBits.ManageMessages],
	async execute(interaction, args, client) {
		const autoresponseStat = await db.autoresponseStat.findOne({ where: { serverID: interaction.guild.id } });

		if (autoresponseStat.stat !== 'enable') {
			const body = { serverID: interaction.guild.id, stat: 'enable' };
			await db.autoresponseStat.create(body);
			return await interaction.reply({ content: 'Autoresponse has been enabled.', ephemeral: true });
		}

		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('yes')
					.setLabel('Yes')
					.setStyle(ButtonStyle.Primary),
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId('no')
					.setLabel('No')
					.setStyle(ButtonStyle.Danger),
			);

		await interaction.reply({ content: 'Autoresponse is already enabled, do you wish to disable it?', components: [row], ephemeral: true });

		client.once('interactionCreate', async (interactionMenu) => {
			if (!interactionMenu.isButton) return;
			interactionMenu.update({ components: [] });
			if (interactionMenu.customId === 'yes') {
				const body = { serverID: interaction.guild.id, stat: 'disable' };
				await db.autoresponseStat.update(body, { where: { serverID: interaction.guild.id } });
				return interaction.editReply({ content: 'Auto response has been disabled.', ephemeral: true });
			}
			else {
				return interaction.editReply({ content: 'Nothing has been changed.', ephemeral: true });
			}
		});
	},
};
