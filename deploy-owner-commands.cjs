const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();
const { clientId, guildId, token } = process.env;

const commands = [
	new SlashCommandBuilder()
		.setName('die')
		.setDescription('Kill the bot'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log(`Successfully registered application commands for the guild ${guildId}.`))
	.catch(console.error);
