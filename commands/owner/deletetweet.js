import { SlashCommandBuilder } from 'discord.js';
import Twit from 'twit';

const { twiConsumer, twiConsumerSecret, twiToken, twiTokenSecret } = process.env;

export default {
	data: new SlashCommandBuilder()
		.setName('deletetweet')
		.setDescription('Delete a tweet')
		.addStringOption(option =>
			option.setName('tweetid')
				.setDescription('The id of the tweet you wish to delete.')
				.setRequired(true)),
	category: 'owner',
	ownerOnly: true,
	async execute(interaction, args) {
		await interaction.deferReply();
		try {
			const T = new Twit({
				consumer_key: twiConsumer,
				consumer_secret: twiConsumerSecret,
				access_token: twiToken,
				access_token_secret: twiTokenSecret,
			});

			T.post('statuses/destroy', {
				id: args.tweetid,
			});
			return interaction.editReply('Tweet have been deleted!');
		}
		catch (err) {
			console.error(err);
			return interaction.editReply('Oh no, an error has occurred :(');
		}
	},
};
