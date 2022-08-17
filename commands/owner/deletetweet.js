import { SlashCommandBuilder } from '@discordjs/builders';
import Twit from 'twit';

import dotenv from 'dotenv';
dotenv.config();
const { twiConsumer, twiConsumerSecret, twiToken, twiTokenSecret } = process.env;

export default {
	data: new SlashCommandBuilder()
		.setName('deletewteet')
		.setDescription('Delete a tweet')
		.addStringOption(option =>
			option.setName('tweetid')
				.setDescription('The id of the tweet you wish to delete.')
				.setRequired(true)),
	ownerOnly: true,
	async execute(interaction) {
		await interaction.deferReply();
		try {
			const T = new Twit({
				consumer_key: twiConsumer,
				consumer_secret: twiConsumerSecret,
				access_token: twiToken,
				access_token_secret: twiTokenSecret,
			});

			T.post('statuses/destroy', {
				id: interaction.options.getString('tweetid'),
			});
			return interaction.editReply('Tweet have been deleted!');
		}
		catch (err) {
			console.error(err);
			return interaction.editReply('Oh no, an error has occurred :(');
		}
	},
};
