module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		const client = interaction.client;
		if (!interaction.isCommand()) return;

		const command = client.commands.get(interaction.commandName);

		console.log(`\x1b[33m${interaction.user.tag}\x1b[0m launched command \x1b[33m${interaction.commandName}\x1b[0m`);

		if (!command) return;

		try {
			await command.execute(interaction);
		}
		catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	},
};
