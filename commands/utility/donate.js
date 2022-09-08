import { SlashCommandBuilder } from 'discord.js';
import { EmbedBuilder } from 'discord.js';
import donations from '../../json/donations.json' assert {type: 'json'};

export default {
	data: new SlashCommandBuilder()
		.setName('donate')
		.setDescription('Show donation link for the bot.'),
	category: 'utility',
	async execute(interaction) {
		let desc = 'If you decide to donate, please do /feedback to let the owner know about it so he can put you in the about and donator command.';
		donations.forEach(m => {
			desc += `\n${m}`;
		});

		const Embed = new EmbedBuilder()
			.setColor(interaction.member ? interaction.member.displayHexColor : 'Navy')
			.setTitle('Donation link')
			.setDescription(desc);

		return interaction.reply({ embeds: [Embed] });
	},
};
