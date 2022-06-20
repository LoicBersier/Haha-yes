import { SlashCommandBuilder } from '@discordjs/builders';
import fetch from 'node-fetch';

export default {
	data: new SlashCommandBuilder()
		.setName('inspirobot')
		.setDescription('Get an image from inspirobot'),
	async execute(interaction) {
		fetch('http://inspirobot.me/api?generate=true')
			.then(res => res.text())
			.then(body => interaction.reply({ files: [body] }));
	},
};
