import { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js';
const { uptimePage } = process.env;
export default {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	category: 'utility',
	async execute(interaction) {

		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setLabel('Status page')
					.setURL(uptimePage)
					.setStyle(ButtonStyle.Link),
			);


		await interaction.reply({ content: `Pong! \`${Math.round(interaction.client.ws.ping)} ms\``, components:  [row] });
	},
};
