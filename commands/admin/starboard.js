import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import fs from 'node:fs';

export default {
	data: new SlashCommandBuilder()
		.setName('starboard')
		.setDescription('Set starboard to the current channel.')
		.addStringOption(option =>
			option.setName('emote')
				.setDescription('The emote that should be used to enter the starboard.'))
		.addStringOption(option =>
			option.setName('count')
				.setDescription('How many react for it to enter starboard.'))
		.addBooleanOption(option =>
			option.setName('remove')
				.setDescription('Remove the starboard')
				.setRequired(false)),
	category: 'admin',
	userPermissions: [PermissionFlagsBits.ManageChannels],
	async execute(interaction, args) {
		if (args.remove) {
			fs.unlink(`./json/board/star${interaction.guild.id}.json`, (err) => {
				if (err) {return interaction.reply('There is no starboard');}
				return interaction.reply('Deleted the starboard');
			});
		}
		else {
			if (!args.emote || !args.count) return interaction.reply('You are missing the emote or the count arg!');
			fs.writeFile(`./json/board/star${interaction.guild.id}.json`, `{"starboard": "${interaction.channel.id}", "emote": "${args.emote}", "count": "${args.count}"}`, (err) => {
				if (err) {
					console.log(err);
				}
			});

			return interaction.reply(`This channel have been set as the starboard with ${args.emote} with the minimum of ${args.count}`);
		}
	},
};
