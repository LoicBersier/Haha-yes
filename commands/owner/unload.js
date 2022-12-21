import { SlashCommandBuilder } from 'discord.js';
import fs from 'node:fs';

export default {
	data: new SlashCommandBuilder()
		.setName('unload')
		.setDescription('Unload a command and replace it with a placeholder')
		.addStringOption(option =>
			option.setName('commandname')
				.setDescription('The command to unload.')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('placeholder')
				.setDescription('The placeholder message you want for the command.'))
		.addBooleanOption(option =>
			option.setName('nofile')
				.setDescription('Don\'t create the placeholder file')),
	category: 'owner',
	ownerOnly: true,
	async execute(interaction, args, client) {
		await interaction.deferReply();
		if (!client.commands.has(args.commandname)) return await interaction.editReply('Command not found.');
		if (!args.placeholder) args.placeholder = 'This command is unloaded, please check back later.';

		if (!args.nofile) {
			fs.writeFileSync(`./unloaded/${args.commandname}.js`, `
			import { SlashCommandBuilder } from 'discord.js';
			
			export default {
				data: ${JSON.stringify(client.commands.get(args.commandname).data)},
				category: '${client.commands.get(args.commandname).category}',
				async execute(interaction) {
					return interaction.reply('${args.placeholder}');
				},
			};
			
			`);
		}

		client.commands.delete(args.commandname);
		if (!args.nofile) {
			let command = await import(`../../unloaded/${args.commandname}.js`);
			command = command.default;

			client.commands.set(args.commandname, command);
		}

		return await interaction.editReply(`${args.commandname} has been unloaded.`);
	},
};
