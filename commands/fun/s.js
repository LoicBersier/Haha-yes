import { SlashCommandBuilder } from '@discordjs/builders';

export default {
	data: new SlashCommandBuilder()
		.setName('s')
		.setDescription('What could this be 🤫')
		.addStringOption(option =>
			option.setName('something')
				.setDescription('🤫')
				.setRequired(true)),
	async execute(interaction) {
		const command = interaction.options.getString('something');

		if (command === 'levertowned') {
			interaction.reply('Hello buddy bro <:youngtroll:488559163832795136> <@434762632004894746>');
		}
	},
};
