import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';
import { exec } from 'node:child_process';
import db from '../../models/index.js';
const donator = db.donator;

import dotenv from 'dotenv';
dotenv.config();
const { ownerId } = process.env;

export default {
	data: new SlashCommandBuilder()
		.setName('about')
		.setDescription('About me (The bot)'),
	async execute(interaction) {
		const Donator = await donator.findAll({ order: ['id'] });
		const client = interaction.client;
		const tina = await client.users.fetch('336492042299637771');
		const owner = await client.users.fetch('267065637183029248');
		const maintainer = await client.users.fetch(ownerId);

		let description = `This bot is made using [discord.js](https://github.com/discordjs/discord.js)\nThanks to ${tina.tag} (336492042299637771) for inspiring me for making this bot!\n\nThe people who donated for the bot <3\n`;

		if (Donator[0]) {
			for (let i = 0; i < Donator.length; i++) {
				const user = await client.users.fetch(Donator[i].get('userID').toString());
				if (user !== null) {
					description += `**${user.tag} (${user.id}) | ${Donator[i].get('comment')}**\n`;
				}
				else {
					description += `**A user of discord (${user.id}) | ${Donator[i].get('comment')} (This user no longer share a server with the bot)**\n`;
				}
			}
		}
		else {
			description += 'No one :(\n';
		}

		// description += '\nThanks to Jetbrains for providing their IDE!';

		exec('git rev-parse --short HEAD', (err, stdout) => {
			const aboutEmbed = new MessageEmbed()
				.setColor(interaction.member ? interaction.member.displayHexColor : 'NAVY')
				.setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: 'https://libtar.de' })
				.setTitle('About me')
				.setDescription(description)
				.addField('Current commit', stdout)
				.addField('Current maintainer: ', `${maintainer.tag} (${ownerId})`)
				.addField('Gitea (Main)', 'https://git.namejeff.xyz/Supositware/Haha-Yes', true)
				.addField('Github (Mirror)', 'https://github.com/Supositware/Haha-yes', true)
				.setFooter({ text: `Original bot made by ${owner.tag} (267065637183029248)` });

			interaction.reply({ embeds: [aboutEmbed] });
		});
	},
};
