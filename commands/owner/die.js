import { SlashCommandBuilder } from '@discordjs/builders';

export default {
	data: new SlashCommandBuilder()
		.setName('die')
		.setDescription('Kill the bot'),
	ownerOnly: true,
	async execute(interaction) {
		console.log('\x1b[31m\x1b[47m\x1b[5mSHUTING DOWN!!!!!\x1b[0m');
		await interaction.reply({ content: 'Good bye', ephemeral: true })
			.then(() => {
				console.log('\x1b[31m\x1b[47m\x1b[5mSHUTING DOWN!!!!!\x1b[0m');
				process.exit(1);
			});
	},
};
