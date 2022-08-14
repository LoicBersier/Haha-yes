import db from '../../models/index.js';
export default {
	name: 'interactionCreate',
	async execute(interaction) {
		const client = interaction.client;
		if (!interaction.isCommand()) return;

		const globalBlacklist = await db.Blacklists.findOne({ where: { type:'global', uid:interaction.user.id } });
		const commandBlacklist = await db.Blacklists.findOne({ where: { type:interaction.commandName, uid:interaction.user.id } });
		if (globalBlacklist) {
			return interaction.reply({ content: 'You are globally blacklisted.', ephemeral: true });
		}
		else if (commandBlacklist) {
			return interaction.reply({ content: 'You are blacklisted.', ephemeral: true });
		}

		const command = client.commands.get(interaction.commandName);

		console.log(`\x1b[33m${interaction.user.tag} (${interaction.user.id})\x1b[0m launched command \x1b[33m${interaction.commandName}\x1b[0m`);

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
