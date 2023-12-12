import { SlashCommandBuilder } from 'discord.js';
import util from 'node:util';
import stream from 'node:stream';
import fs from 'node:fs';

export default {
	data: new SlashCommandBuilder()
		.setName('downloadandload')
		.setDescription('Download a command and load it.')
		.addAttachmentOption(option =>
			option.setName('file')
				.setDescription('The .js file that will be loaded by the bot.')
				.setRequired(true)),
	category: 'owner',
	ownerOnly: true,
	async execute(interaction, args, client) {
		await interaction.deferReply();

		const streamPipeline = util.promisify(stream.pipeline);
		const res = await fetch(args.file.url);
		if (!res.ok) return interaction.editReply('An error has occured while trying to download the command.');
		await streamPipeline(res.body, fs.createWriteStream(`./tmp/${args.file.name}`));

		let command = await import(`../../tmp/${args.file.name}`);
		command = command.default;

		client.commands.set(command.data.name, command);
		return await interaction.editReply(`${command.data.name} has been loaded.`);
	},
};
