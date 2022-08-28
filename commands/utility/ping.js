import { SlashCommandBuilder } from 'discord.js';

export default {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	category: 'utility',
	async execute(interaction) {
		await interaction.reply(`Pong! \`${Math.round(interaction.client.ws.ping)} ms\``);
	},
};
