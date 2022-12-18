import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';

export default {
	data: new SlashCommandBuilder()
		.setName('reddit')
		.setDescription('Send random images from the subreddit you choose')
		.addStringOption(option =>
			option.setName('subreddit')
				.setDescription('The subreddit you wish to see')
				.setRequired(true)),
	category: 'fun',
	async execute(interaction, args) {
		await interaction.deferReply({ ephemeral: false });
		const subreddit = args.subreddit;
		fetch('https://www.reddit.com/r/' + subreddit + '.json?limit=100').then((response) => {
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

			let description = response.data.children[i].data.selftext;
			if (description === '') {
				description = 'No description.';
			}
			const redditEmbed = new EmbedBuilder()
				.setColor(interaction.member ? interaction.member.displayHexColor : 'Navy')
				.setTitle(response.data.children[i].data.title)
				.setDescription(description)
				.setURL('https://reddit.com' + response.data.children[i].data.permalink)
				.setFooter({ text: `/r/${response.data.children[i].data.subreddit} | ⬆ ${response.data.children[i].data.ups} 🗨 ${response.data.children[i].data.num_comments}` });

			interaction.followUp({ embeds: [redditEmbed] });
			interaction.followUp(response.data.children[i].data.url);
		});
	},
};
