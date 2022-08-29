import { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import db from '../../models/index.js';

export default {
	data: new SlashCommandBuilder()
		.setName('autoresponse')
		.setDescription('Enable or disable autoresponse'),
	category: 'utility',
	async execute(interaction, args, client) {
		const autoresponseStat = await db.autoresponseStat.findOne({ where: { serverID: interaction.guild.id } });

		if (autoresponseStat.stat !== 'enable') {
			const body = { serverID: interaction.guild.id, stat: 'enable' };
			await db.autoresponseStat.create(body);
			return await interaction.reply({ content: 'Autoresponse has been enabled.' });
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

		await interaction.reply({ content: 'Autoresponse is already enabled, do you wish to disable it?', components: [row] });

		client.once('interactionCreate', async (interactionMenu) => {
			if (!interactionMenu.isButton) return;
			interactionMenu.update({ components: [] });
			if (interactionMenu.customId === 'yes') {
				const body = { serverID: interaction.guild.id, stat: 'disable' };
				await db.autoresponseStat.update(body, { where: { serverID: interaction.guild.id } });
				return interaction.editReply('Auto response has been disabled.');
			}
			else {
				return interaction.editReply('Nothing has been changed.');
			}
		});
	},
};
