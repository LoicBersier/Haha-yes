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
		const reason = args.reason ? args.reason : 'No reason has been specified.';

		const blacklist = await Blacklists.findOne({ where: { type:command, uid:userid } });

		if (!blacklist) {
			const body = { type:command, uid: userid, reason: reason };
			Blacklists.create(body);
			let user = userid;
			await client.users.fetch(userid);
			user = client.users.resolve(userid).username;


			return interaction.editReply(`${user} (${userid}) has been blacklisted from ${command} with the following reason \`${reason}\``);
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

			await interaction.editReply({ content: 'This user is already blacklisted, do you want to unblacklist him?', ephemeral: true, components: [row] });

			return listenButton(client, interaction, command, userid, interaction.user);
		}
	},
};

async function listenButton(client, interaction, command, userid, user = interaction.user, originalId = interaction.id) {
	client.once('interactionCreate', async (interactionMenu) => {
		if (user !== interactionMenu.user) return listenButton(client, interaction, command, userid, user, originalId);
		if (!interactionMenu.isButton()) return;

		await interactionMenu.update({ components: [] });

		if (interactionMenu.customId === `yes${interaction.user.id}${originalId}`) {
			Blacklists.destroy({ where: { type:command, uid:userid } });
			return interaction.editReply(`The following ID have been unblacklisted from ${command}: ${userid}`);
		}
		else {
			return interaction.editReply('No one has been unblacklisted.');
		}
	});
}