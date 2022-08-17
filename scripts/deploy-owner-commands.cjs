const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();
const { clientId, guildId, token } = process.env;

const commands = [
	new SlashCommandBuilder()
		.setName('die')
		.setDescription('Kill the bot'),

	new SlashCommandBuilder()
		.setName('ublacklist')
		.setDescription('Blacklist a user from the bot')
		.addStringOption(option =>
			option.setName('command')
				.setDescription('Which command do you want to get a user blacklisted from?')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('userid')
				.setDescription('Who do you want to blacklist?')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('The reason of the blacklist.')
				.setRequired(false)),

	new SlashCommandBuilder()
		.setName('deletewteet')
		.setDescription('Delete a tweet')
		.addStringOption(option =>
			option.setName('tweetid')
				.setDescription('The id of the tweet you wish to delete.')
				.setRequired(true)),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log(`Successfully registered application commands for the guild ${guildId}.`))
	.catch(console.error);
