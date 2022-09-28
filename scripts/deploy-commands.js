import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
dotenv.config();
const { clientId, guildId, token } = process.env;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands = [];
const categoryPath = fs.readdirSync(`${__dirname}/../commands`);
categoryPath.forEach(category => {
	loadCommandFromDir(category);
});
commands.map(command => command.toJSON());

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

async function loadCommandFromDir(dir) {
	const commandsPath = path.join(`${__dirname}/../commands`, dir);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		let command = await import(filePath);
		command = command.default;
		commands.push(command.data);
	}
}