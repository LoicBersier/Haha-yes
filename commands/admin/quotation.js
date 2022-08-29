import { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionFlagsBits } from 'discord.js';
import db from '../../models/index.js';

export default {
	data: new SlashCommandBuilder()
		.setName('quotation')
		.setDescription('Enable or disable quotations'),
	category: 'utility',
	userPermissions: [PermissionFlagsBits.ManageMessages],
	async execute(interaction, args, client) {
		const quotationstat = await db.quotationstat.findOne({ where: { serverID: interaction.guild.id } });

		if (quotationstat.stat !== 'enable') {
			const body = { serverID: interaction.guild.id, stat: 'enable' };
			await db.quotationstat.create(body);
			return await interaction.reply({ content: 'Quotation has been enabled.' });
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

		await interaction.reply({ content: 'Quotation is already enabled, do you wish to disable it?', components: [row] });

		client.once('interactionCreate', async (interactionMenu) => {
			if (!interactionMenu.isButton) return;
			interactionMenu.update({ components: [] });
			if (interactionMenu.customId === 'yes') {
				const body = { serverID: interaction.guild.id, stat: 'disable' };
				await db.quotationstat.update(body, { where: { serverID: interaction.guild.id } });
				return interaction.editReply('Quotation has been disabled.');
			}
			else {
				return interaction.editReply('Nothing has been changed.');
			}
		});
	},
};
