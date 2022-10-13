import { ButtonStyle, SlashCommandBuilder, ButtonBuilder, ActionRowBuilder } from 'discord.js';
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
	category: 'owner',
	ownerOnly: true,
	async execute(interaction, args) {
		await interaction.deferReply({ ephemeral: true });
		const client = interaction.client;
		const command = args.command;
		const userid = args.userid;
		const reason = args.reason;

		const blacklist = await Blacklists.findOne({ where: { type:command, uid:userid } });

		if (!blacklist) {
			const body = { type:command, uid: userid, reason: reason };
			Blacklists.create(body);
			let user = userid;
			if (command !== 'guild') {user = client.users.resolve(userid).tag;}

			return interaction.editReply(`${user} has been blacklisted from ${command} with the following reason ${reason}`);
		}
		else {
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

			await interaction.editReply({ content: 'This user is already blacklisted, do you want to unblacklist him?', ephemeral: true, components: [row] });

			interaction.client.on('interactionCreate', async (interactionMenu) => {
				if (interaction.user !== interactionMenu.user) return;
				if (!interactionMenu.isButton) return;
				interactionMenu.update({ components: [] });
				if (interactionMenu.customId === `yes${interaction.user.id}`) {
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
