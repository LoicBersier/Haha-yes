import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';

const { feedbackChannelId } = process.env;

export default {
	data: new SlashCommandBuilder()
		.setName('feedback')
		.setDescription('Send a feedback to the developer.')
		.addStringOption(option =>
			option.setName('feedback')
				.setDescription('The message you want to send me.')
				.setRequired(true)),
	async execute(interaction) {
		const Embed = new MessageEmbed()
			.setAuthor({ name: `${interaction.user.tag} (${interaction.user.id})`, iconURL: interaction.user.avatarURL() })
			.setTimestamp();

		if (interaction.guild) Embed.addField('Guild', `${interaction.guild.name} (${interaction.guild.id})`, true);
		Embed.addField('Feedback', interaction.options.getString('feedback'));

		// Don't let new account use this command to prevent spam
		const date = new Date();
		if (interaction.user.createdAt > date.setDate(date.getDate() - 7)) {
			return interaction.reply({ content: '❌ Your account is too new to be able to use this command!', ephemeral: true });
		}

		const channel = interaction.client.channels.resolve(feedbackChannelId);
		channel.send({ embeds: [Embed] });
		await interaction.reply({ content: 'Your feedback has been sent! Don\'t forget to have dm open if you want to get an answer from the dev!', ephemeral: true });
	},
};
