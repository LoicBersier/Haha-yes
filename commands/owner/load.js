import { SlashCommandBuilder } from 'discord.js';

export default {
	data: new SlashCommandBuilder()
		.setName('load')
		.setDescription('load a command.')
		.addStringOption(option =>
			option.setName('file')
				.setDescription('File location of the command.')
				.setRequired(true)),
	category: 'owner',
	ownerOnly: true,
	async execute(interaction, args, client) {
		await interaction.deferReply();

		let command = await import(`../../${args.file}`);
		command = command.default;

		client.commands.set(command.data.name, command);
		return await interaction.editReply(`${command.data.name} has been loaded.`);
	},
};
