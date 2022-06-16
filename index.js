import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client, Collection, Intents } from 'discord.js';
import dotenv from 'dotenv'
dotenv.config()
const { token } = process.env;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Load commands from the commands folder
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	let command = await import(filePath);
	command = command.default;

	client.commands.set(command.data.name, command);
}

// Load events from the events folder
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	let event = await import(filePath);
	event = event.default;
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(token);
