import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageButton, MessageActionRow } from 'discord.js';
import db from '../../models/index.js';
const Blacklists = db.Blacklists;

export default {
	data: new SlashCommandBuilder()
		.setName('ublacklist')
		.setDescription('Blacklist a user from the bot')
		.addStringOption(option =>
			option.setName('command')
				.setDescription('Which command do you want to get a user blacklisted from?')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('userid')
				.setDescription('Who do you want to blacklist?')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('The reason of the blacklist.')
				.setRequired(false)),
	ownerOnly: true,
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		const client = interaction.client;
		const command = interaction.options.getString('command');
		const userid = interaction.options.getString('userid');
		const reason = interaction.options.getString('reason');

		const blacklist = await Blacklists.findOne({ where: { type:command, uid:userid } });

		if (!blacklist) {
			const body = { type:command, uid: userid, reason: reason };
			Blacklists.create(body);
			let user = userid;
			if (command !== 'guild') {user = client.users.resolve(userid).tag;}

			return interaction.editReply(`${user} has been blacklisted from ${command} with the following reason ${reason}`);
		}
		else {
			const row = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('yes')
						.setLabel('Yes')
						.setStyle('PRIMARY'),
				)
				.addComponents(
					new MessageButton()
						.setCustomId('no')
						.setLabel('No')
						.setStyle('DANGER'),
				);

			await interaction.editReply({ content: 'This user is already blacklisted, do you want to unblacklist him?', ephemeral: true, components: [row] });

			interaction.client.once('interactionCreate', async (interactionMenu) => {
				if (!interactionMenu.isButton) return;
				interactionMenu.update({ components: [] });
				if (interactionMenu.customId === 'yes') {
					Blacklists.destroy({ where: { type:command, uid:userid } });
					return interaction.editReply(`The following ID have been unblacklisted from ${command}: ${userid}`);
				}
				else {
					return interaction.editReply('No one has been unblacklisted.');
				}
			});
		}
	},
};
