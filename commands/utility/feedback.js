import { SlashCommandBuilder } from 'discord.js';
import { EmbedBuilder } from 'discord.js';

const { feedbackChannelId } = process.env;

export default {
	data: new SlashCommandBuilder()
		.setName('feedback')
		.setDescription('Send a feedback to the developer.')
		.addStringOption(option =>
			option.setName('feedback')
				.setDescription('The message you want to send me.')
				.setRequired(true))
		.addAttachmentOption(option =>
			option.setName('image')
				.setDescription('Optional attachment.')
				.setRequired(false)),
	category: 'utility',
	async execute(interaction, args) {
		const Embed = new EmbedBuilder()
			.setAuthor({ name: `${interaction.user.username} (${interaction.user.id})`, iconURL: interaction.user.avatarURL() })
			.setTimestamp();

		if (interaction.guild) Embed.addFields({ name: 'Guild', value: `${interaction.guild.name} (${interaction.guild.id})`, inline: true });
		Embed.addFields({ name: 'Feedback', value: args.feedback, inline: true });

		// Don't let new account use this command to prevent spam
		const date = new Date();
		if (interaction.user.createdAt > date.setDate(date.getDate() - 7)) {
			return interaction.reply({ content: '❌ Your account is too new to be able to use this command!', ephemeral: true });
		}

		const channel = interaction.client.channels.resolve(feedbackChannelId);
		if (args.image) {
			channel.send({ embeds: [Embed], files: [args.image] });
		}
		else {
			channel.send({ embeds: [Embed] });
		}
		await interaction.reply({ content: 'Your feedback has been sent! Don\'t forget to have dm open if you want to get an answer from the dev!', ephemeral: true });
	},
};
