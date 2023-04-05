import { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionFlagsBits } from 'discord.js';
import db from '../../models/index.js';

export default {
	data: new SlashCommandBuilder()
		.setName('quotation')
		.setDescription('Enable or disable quotations')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
	category: 'admin',
	async execute(interaction, args, client) {
		const quotationstat = await db.quotationStat.findOne({ where: { serverID: interaction.guild.id } });

		if (!quotationstat) {
			const body = { serverID: interaction.guild.id, stat: 'enable' };
			await db.quotationStat.create(body);
			return await interaction.reply({ content: 'Quotation has been enabled.', ephemeral: true });
		}


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

		if (quotationstat.stat === 'enable') {
			await interaction.reply({ content: 'Quotation is already enabled, do you wish to disable it?', components: [row], ephemeral: true });
		}
		else {
			const body = { serverID: interaction.guild.id, stat: 'enable' };
			await db.autoresponseStat.update(body, { where: { serverID: interaction.guild.id } });
			return interaction.editReply({ content: 'Quotation has been enabled.', ephemeral: true });
		}

		return listenButton(client, interaction, interaction.user);
	},
};

async function listenButton(client, interaction, user = interaction.user, originalId = interaction.id) {
	client.once('interactionCreate', async (interactionMenu) => {
		if (user !== interactionMenu.user) return listenButton(client, interaction, user, originalId);
		if (!interactionMenu.isButton()) return;

		interactionMenu.update({ components: [] });

		if (interactionMenu.customId === `yes${interaction.user.id}${originalId}`) {
			await db.quotationStat.destroy({ where: { serverID: interaction.guild.id } });
			return interaction.editReply({ content: 'Quotation has been disabled.', ephemeral: true });
		}
		else {
			return interaction.editReply({ content: 'Nothing has been changed.', ephemeral: true });
		}
	});
}