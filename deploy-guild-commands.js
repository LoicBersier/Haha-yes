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
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
