const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();
const { clientId, guildId, token } = process.env;

const commands = [
	new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with pong!'),

	new SlashCommandBuilder()
		.setName('download')
		.setDescription('Download a video. (100 mb max)')
		.addStringOption(option =>
			option.setName('url')
				.setDescription('URL of the video you want to download.')
				.setRequired(true))
		.addBooleanOption(option =>
			option.setName('advanced')
				.setDescription('Choose the quality of the video.')
				.setRequired(false)),


	new SlashCommandBuilder()
		.setName('reddit')
		.setDescription('Send random images from the subreddit you choose')
		.addStringOption(option =>
			option.setName('subreddit')
				.setDescription('The subreddit you wish to see')
				.setRequired(true)),

	new SlashCommandBuilder()
		.setName('vid2gif')
		.setDescription('Convert your video into a gif.')
		.addStringOption(option =>
			option.setName('url')
				.setDescription('URL of the video you want to convert')
				.setRequired(true)),

	new SlashCommandBuilder()
		.setName('feedback')
		.setDescription('Send a feedback to the developer.')
		.addStringOption(option =>
			option.setName('feedback')
				.setDescription('The message you want to send me.')
				.setRequired(true)),

	new SlashCommandBuilder()
		.setName('inspirobot')
		.setDescription('Get an image from inspirobot'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

if (process.argv[2] === 'global') {
	rest.put(Routes.applicationCommands(clientId), { body: commands })
		.then(() => console.log('Successfully registered application commands globally.'))
		.catch(console.error);
}

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log(`Successfully registered application commands for the guild ${guildId}.`))
	.catch(console.error);
