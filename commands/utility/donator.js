import { SlashCommandBuilder } from 'discord.js';
import db from '../../models/index.js';
const donator = db.donator;

export default {
	data: new SlashCommandBuilder()
		.setName('donator')
		.setDescription('All the people who donated for this bot <3'),
	category: 'utility',
	async execute(interaction) {
		await interaction.deferReply();
		const client = interaction.client;
		const Donator = await donator.findAll({ order: ['id'] });

		let donatorMessage = 'Thanks to:\n';

		if (Donator[0]) {
			for (let i = 0; i < Donator.length; i++) {
				const user = await client.users.fetch(Donator[i].get('userID').toString());
				if (user !== null) {donatorMessage += `**${user.username} (${user.id}) | ${Donator[i].get('comment')}**\n`;}
				else {donatorMessage += `**A user of discord (${user.id}) | ${Donator[i].get('comment')} (This user no longer share a server with the bot)**\n`;}

			}
		}
		else {
			donatorMessage += 'No one :(';
		}

		return interaction.editReply(donatorMessage);
	},
};
