import { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionFlagsBits } from 'discord.js';
import db from '../../models/index.js';

export default {
	data: new SlashCommandBuilder()
		.setName('welcome')
		.setDescription('Set a join message')
		.addStringOption(option =>
			option.setName('message')
				.setDescription('The message you want the bot to say when someone join in the current channel.')),
	category: 'admin',
	userPermissions: [PermissionFlagsBits.ManageChannels],
	async execute(interaction, args, client) {
		const join = await db.joinChannel.findOne({ where: { guildID: interaction.guild.id } });

		if (!join && !args.message) {
			return interaction.reply({ content: 'You need a message for me to say anything!', ephemeral: true });
		}
		else if (!join) {
			const body = { guildID: interaction.guild.id, channelID: interaction.channel.id, message: args.message };
			await db.joinChannel.create(body);
			return interaction.reply({ content: `The join message have been set with ${args.message}`, ephemeral: true });
		}


		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('edit')
					.setLabel('Edit')
					.setStyle(ButtonStyle.Primary),
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId('remove')
					.setLabel('Remove')
					.setStyle(ButtonStyle.Danger),
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId('nothing')
					.setLabel('Do nothing')
					.setStyle(ButtonStyle.Secondary),
			);

		await interaction.reply({ content: 'The server already has a message set, do you want to edit it or remove it?', components: [row], ephemeral: true });

		client.on('interactionCreate', async (interactionMenu) => {
			if (interaction.user !== interactionMenu.user) return;
			if (!interactionMenu.isButton) return;
			interactionMenu.update({ components: [] });
			if (interactionMenu.customId === 'edit') {
				if (!args.message) {
					return interaction.reply({ content: 'You need to input a message for me to edit!', ephemeral: true });
				}
				const body = { guildID: interaction.guild.id, channelID: interaction.channel.id, message: args.message };
				await db.joinChannel.update(body, { where: { guildID: interaction.guild.id } });
				return interaction.editReply({ content: `The join message has been set to ${args.message}`, ephemeral: true });
			}
			else if (interactionMenu.customId === 'remove') {
				db.joinChannel.destroy({ where: { guildID: interaction.guild.id, channelID: interaction.channel.id } });
				return interaction.editReply({ content: 'The join message has been deleted.', ephemeral: true });
			}
			else {
				return interaction.editReply({ content: 'Nothing has been changed.', ephemeral: true });
			}
		});
	},
};
