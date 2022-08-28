import { SlashCommandBuilder } from 'discord.js';
import fetch from 'node-fetch';

export default {
	data: new SlashCommandBuilder()
		.setName('inspirobot')
		.setDescription('Get an image from inspirobot'),
	category: 'fun',
	async execute(interaction) {
		fetch('http://inspirobot.me/api?generate=true')
			.then(res => res.text())
			.then(body => interaction.reply({ files: [body] }));
	},
};
