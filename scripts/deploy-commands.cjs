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
		.setDescription('Download a video.')
		.addStringOption(option =>
			option.setName('url')
				.setDescription('url of the video you want to download.')
				.setRequired(true))
		.addBooleanOption(option =>
			option.setName('format')
				.setDescription('Choose the quality of the video.')
				.setRequired(false))
		.addBooleanOption(option =>
			option.setName('compress')
				.setDescription('Compress the video?')
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

	new SlashCommandBuilder()
		.setName('tweet')
		.setDescription('Send tweet from Haha yes twitter account. Please do not use it for advertisement and keep it english')
		.addStringOption(option =>
			option.setName('content')
				.setDescription('The content of the tweet you want to send me.')
				.setRequired(false))
		.addAttachmentOption(option =>
			option.setName('image')
				.setDescription('Optional attachment (Image only.)')
				.setRequired(false)),

	new SlashCommandBuilder()
		.setName('4chan')
		.setDescription('Send random images from a 4chan board of your choosing!')
		.addStringOption(option =>
			option.setName('board')
				.setDescription('The board you wish to see')
				.setRequired(true)),

	new SlashCommandBuilder()
		.setName('donator')
		.setDescription('All the people who donated for this bot <3'),

	new SlashCommandBuilder()
		.setName('donate')
		.setDescription('Show donation link for the bot.'),

	new SlashCommandBuilder()
		.setName('about')
		.setDescription('About me (The bot)'),

	new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Show some stats about the bot'),

	new SlashCommandBuilder()
		.setName('fakeuser')
		.setDescription('Fake a user with webhooks')
		.addMentionableOption(option =>
			option.setName('user')
				.setDescription('Who do you want to fake?')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('message')
				.setDescription('What message do you want me to send?')
				.setRequired(true))
		.addAttachmentOption(option =>
			option.setName('image')
				.setDescription('Optional attachment (Image only.)')
				.setRequired(false)),

	new SlashCommandBuilder()
		.setName('s')
		.setDescription('What could this be 🤫')
		.addStringOption(option =>
			option.setName('something')
				.setDescription('🤫')
				.setRequired(true)),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

if (process.argv[2] === 'global') {
	rest.put(Routes.applicationCommands(clientId), { body: commands })
		.then(() => console.log('Successfully registered application commands globally.'))
		.catch(console.error);
}
else if (process.argv[2] === 'delete') {
	rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
		.then(() => console.log('Successfully deleted all guild commands.'))
		.catch(console.error);
}

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log(`Successfully registered application commands for the guild ${guildId}.`))
	.catch(console.error);