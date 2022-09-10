import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import fs from 'node:fs';

export default {
	data: new SlashCommandBuilder()
		.setName('shameboard')
		.setDescription('Set shameboard to the current channel.')
		.addStringOption(option =>
			option.setName('emote') 
				.setDescription('The emote that should be used to enter the shameboard.'))
		.addStringOption(option =>
			option.setName('count')
				.setDescription('How many react for it to enter shameboard.'))
		.addBooleanOption(option =>
			option.setName('remove')
				.setDescription('Remove the shameboard')
				.setRequired(false)),
	category: 'admin',
	userPermissions: [PermissionFlagsBits.ManageChannels],
	async execute(interaction, args) {
		if (args.remove) {
			fs.unlink(`./json/board/shame${interaction.guild.id}.json`, (err) => {
				if (err) {return interaction.reply('There is no shameboard');}
				return interaction.reply('Deleted the shameboard');
			});
		}
		else {
			if (!args.emote || !args.count) return interaction.reply('You are missing the emote or the count arg!');
			fs.writeFile(`./json/board/shame${interaction.guild.id}.json`, `{"shameboard": "${interaction.channel.id}", "emote": "${args.emote}", "count": "${args.count}"}`, (err) => {
				if (err) {
					console.log(err);
				}
			});

			return interaction.reply(`This channel have been set as the shameboard with ${args.emote} with the minimum of ${args.count}`);
		}
	},
};
