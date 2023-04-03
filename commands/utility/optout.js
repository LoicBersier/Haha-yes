import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import db from '../../models/index.js';

export default {
	data: new SlashCommandBuilder()
		.setName('optout')
		.setDescription('Opt out of the non commands features and arguments logging (for debugging purposes)'),
	category: 'utility',
	async execute(interaction, args, client) {
		const isOptOut = await db.optout.findOne({ where: { userID: interaction.user.id } });

		if (!isOptOut) {
			const body = { userID: interaction.user.id };
			await db.optout.create(body);
			return await interaction.reply({ content: 'You have successfully been opt out.' });
		}

		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId(`yes${interaction.user.id}`)
					.setLabel('Yes')
					.setStyle(ButtonStyle.Primary),
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId(`no${interaction.user.id}`)
					.setLabel('No')
					.setStyle(ButtonStyle.Danger),
			);

		await interaction.reply({ content: 'You are already opt out, do you wish to opt in?', components: [row] });

		client.on('interactionCreate', async (interactionMenu) => {
			if (interaction.user !== interactionMenu.user) return;
			if (!interactionMenu.isButton) return;
			interactionMenu.update({ components: [] });
			if (interactionMenu.customId === `yes${interaction.user.id}`) {
				await db.optout.destroy({ where: { userID: interaction.user.id } });
				return interaction.editReply('You have successfully been opt in');
			}
			else {
				return interaction.editReply('Nothing has been changed.');
			}
		});
	},
};
