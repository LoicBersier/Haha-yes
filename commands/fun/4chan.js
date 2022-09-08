import { SlashCommandBuilder } from 'discord.js';
import { EmbedBuilder } from 'discord.js';
import TurndownService from 'turndown';
const turndown = new TurndownService();
import fetch from 'node-fetch';

import fourChan from '../../json/4chan.json' assert {type: 'json'};

export default {
	data: new SlashCommandBuilder()
		.setName('4chan')
		.setDescription('Send random images from a 4chan board of your choosing!')
		.addStringOption(option =>
			option.setName('board')
				.setDescription('The board you wish to see')
				.setRequired(true)),
	category: 'fun',
	async execute(interaction, args) {
		let board = args.board;

		if (fourChan[board] == undefined) {
			return interaction.reply({ content: 'Uh oh! The board you are looking for does not exist? You think this is a mistake? Please send a feedback telling me so!', ephemeral: true });
		}

		if (fourChan[board].nsfw && !interaction.channel.nsfw) {
			return interaction.reply({ content: 'Uh oh! This is a NSFW board! Try again in a NSFW channel!', ephemeral: true });
		}
		await interaction.deferReply({ ephemeral: false });

		board = board.replace(/\//g, '');
		let i = Math.floor((Math.random() * 5) + 1);


		fetch(`https://a.4cdn.org/${board}/${i}.json`).then((response) => {
			return response.json();
		}).then((response) => {
			if (!response.threads) {
				return interaction.editReply('Not a valid board! Try again!');
			}

			i = Math.floor((Math.random() * response.threads.length) + 1);

			// Loop until it found a threads
			while (!response.threads[i]) {
				i = Math.floor((Math.random() * response.threads.length) + 1);
			}

			// If post is sticky search again
			while (response.threads[i].posts[0].sticky == 1 || !response.threads[i].posts) {
				i = Math.floor((Math.random() * response.threads.length));
			}

			let title = response.threads[i].posts[0].sub;
			let description = response.threads[i].posts[0].com;
			let boardName = fourChan[board].title;
			if (boardName == undefined) {
				boardName = board;
			}

			// If title or description is undefined, change it to "no title/description"
			if (!description) {
				description = 'No description';
			}

			if (!title) {
				title = 'No title';
			}

			const FourchanEmbed = new EmbedBuilder()
				.setColor(interaction.member ? interaction.member.displayHexColor : 'Navy')
				.setTitle(turndown.turndown(title))
				.setDescription(turndown.turndown(description))
				.setImage(`https://i.4cdn.org/${board}/${response.threads[i].posts[0].tim}${response.threads[i].posts[0].ext}`)
				.setURL(`https://boards.4chan.org/${board}/thread/${response.threads[i].posts[0].no}/${response.threads[i].posts[0].semantic_url}`)
				.setFooter({ text: `${boardName} | ${response.threads[i].posts[0].name} | ${response.threads[i].posts[0].no}  | ${response.threads[i].posts[0].now}` });

			// If file type dosen't work on embed, send it as a link
			if (response.threads[i].posts[0].ext == '.webm' || response.threads[i].posts[0].ext == '.pdf' || response.threads[i].posts[0].ext == '.swf') {
				interaction.editReply({ embeds: [FourchanEmbed] });
				interaction.followUp(`https://i.4cdn.org/${board}/${response.threads[i].posts[0].tim}${response.threads[i].posts[0].ext}`);

			}
			else {
				interaction.editReply({ embeds: [FourchanEmbed] });
			}
		})
			.catch((err) => {
				if (err.type == 'invalid-json') return interaction.editReply('Could not find the board! Try again!');
				console.error(err);
				return interaction.editReply('Uh-oh, an error has occurred! Try again! If this keeps happening, tell the developers!');
			});
	},
};
