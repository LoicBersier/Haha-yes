import { SlashCommandBuilder } from '@discordjs/builders';
import dotenv from 'dotenv';
import process from 'node:process';
dotenv.config();
const { ownerId } = process.env;

export default {
	data: new SlashCommandBuilder()
		.setName('die')
		.setDescription('Kill the bot'),
	async execute(interaction) {
		if (interaction.user.id !== ownerId) {
			return interaction.reply({ content: '❌ This command is reserved for the owner!', ephemeral: true });
		}
		console.log('\x1b[31m\x1b[47m\x1b[5mSHUTING DOWN!!!!!\x1b[0m');
		await interaction.reply({ content: 'Good bye', ephemeral: true })
			.then(() => {
				console.log('\x1b[31m\x1b[47m\x1b[5mSHUTING DOWN!!!!!\x1b[0m');
				process.exit(1);
			});
	},
};
