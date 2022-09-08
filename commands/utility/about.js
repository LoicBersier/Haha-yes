import { SlashCommandBuilder } from 'discord.js';
import { EmbedBuilder } from 'discord.js';
import { exec } from 'node:child_process';
import db from '../../models/index.js';
const donator = db.donator;

const { ownerId } = process.env;

export default {
	data: new SlashCommandBuilder()
		.setName('about')
		.setDescription('About me (The bot)'),
	category: 'utility',
	async execute(interaction) {
		const Donator = await donator.findAll({ order: ['id'] });
		const client = interaction.client;
		const tina = await client.users.fetch('336492042299637771');
		const owner = await client.users.fetch('267065637183029248');
		const maintainer = await client.users.fetch(ownerId);

		let description = 'I\'m a fun multipurpose bot made using [discord.js](https://github.com/discordjs/discord.js)'
		+ '\nFor a better experience use the slash commands!\n\nThe people who donated for the bot <3\n';

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

		description += `\nThanks to ${tina.tag} (336492042299637771) for inspiring me for making this bot!`;

		// description += '\nThanks to Jetbrains for providing their IDE!';

		exec('git rev-parse --short HEAD', (err, stdout) => {
			const aboutEmbed = new EmbedBuilder()
				.setColor(interaction.member ? interaction.member.displayHexColor : 'Navy')
				.setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: 'https://libtar.de' })
				.setTitle('About me')
				.setDescription(description)
				.addFields(
					{ name: 'Current commit', value: stdout },
					{ name: 'Current maintainer', value: `${maintainer.tag} (${ownerId})` },
					{ name: 'Gitea (Main)', value: 'https://git.namejeff.xyz/Supositware/Haha-Yes', inline: true },
					{ name: 'Github (Mirror)', value: 'https://github.com/Supositware/Haha-yes', inline: true },
					{ name: 'Privacy Policy', value: 'https://libtar.de/discordprivacy.txt' },

				)
				.setFooter({ text: `Original bot made by ${owner.tag} (267065637183029248)` });

			interaction.reply({ embeds: [aboutEmbed] });
		});
	},
};
