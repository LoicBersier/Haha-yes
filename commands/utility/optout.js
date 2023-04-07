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
			await interaction.reply({ content: 'You have successfully been opt out.', ephemeral: true });
		}
		else {
			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`yes${interaction.user.id}${interaction.id}`)
						.setLabel('Yes')
						.setStyle(ButtonStyle.Primary),
				)
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`no${interaction.user.id}${interaction.id}`)
						.setLabel('No')
						.setStyle(ButtonStyle.Danger),
				);

			await interaction.reply({ content: 'You are already opt out, do you wish to opt in?', components: [row], ephemeral: true });

			listenButton(client, interaction, interaction.user);
		}

		return interaction.followUp({
			content:
			'As a reminder here what opting out does:\n'
			+	'- Your user ID will no longer be used for debug logging.\n'
			+ 	'- servers will no longer be shown in added/kicked stats.\n'
			+	'- Your messages won\'t be quoted.\n'
			+	'- Won\'t show the arguments from commands.',
			ephemeral: true,
		},
		);
	},
};


async function listenButton(client, interaction, user = interaction.user, originalId = interaction.id) {
	client.once('interactionCreate', async (interactionMenu) => {
		if (user !== interactionMenu.user) return listenButton(client, interaction, user, originalId);
		if (!interactionMenu.isButton()) return;

		await interactionMenu.update({ components: [] });

		if (interactionMenu.customId === `yes${interaction.user.id}${originalId}`) {
			db.optout.destroy({ where: { userID: interaction.user.id } });
			return interaction.editReply({ content: 'You have successfully been opt in', ephemeral: true });
		}
		else {
			return interaction.editReply({ content: 'Nothing has been changed.', ephemeral: true });
		}
	});
}