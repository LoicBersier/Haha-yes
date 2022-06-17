import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';

export default {
	data: new SlashCommandBuilder()
		.setName('reddit')
		.setDescription('Send random images from the subreddit you choose')
		.addStringOption(option =>
			option.setName('subreddit')
				.setDescription('The subreddit you wish to see')
				.setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: false });

		fetch('https://www.reddit.com/r/' + interaction.options.getString('subreddit') + '.json?limit=100').then((response) => {
			return response.json();
		}).then((response) => {
			if (response.error == 404) {
				return interaction.editReply('Not a valid subreddit');
			}
			if (response.data.dist == 0) {
				return interaction.editReply('Not a valid subreddit');

			}
			const i = Math.floor((Math.random() * response.data.children.length));
			if (response.data.children[i].data.over_18 == true && !interaction.channel.nsfw) {
				return interaction.editReply('No nsfw');
			}
			const redditEmbed = new MessageEmbed()
				.setColor(interaction.member ? interaction.member.displayHexColor : 'NAVY')
				.setTitle(response.data.children[i].data.title)
				.setDescription(response.data.children[i].data.selftext)
				.setURL('https://reddit.com' + response.data.children[i].data.permalink)
				.setFooter(`/r/${response.data.children[i].data.subreddit} | ⬆ ${response.data.children[i].data.ups} 🗨 ${response.data.children[i].data.num_comments}`);

			interaction.editReply({ embeds: [redditEmbed] });
			interaction.followUp(response.data.children[i].data.url);
		});
	},
};
