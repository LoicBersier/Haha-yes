import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client, Collection, Intents } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();
const { token } = process.env;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({ intents: [Intents.FLAGS.GUILDS], shards: 'auto' });

// Load commands
client.commands = new Collection();
await loadCommandFromDir('fun');
await loadCommandFromDir('utility');
await loadCommandFromDir('admin');
await loadCommandFromDir('owner');

// Load events
await loadEventFromDir('client', client);
await loadEventFromDir('process', process);

client.login(token);

async function loadCommandFromDir(dir) {
	const commandsPath = path.join(`${__dirname}/commands`, dir);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		let command = await import(filePath);
		command = command.default;

		client.commands.set(command.data.name, command);
	}
}

async function loadEventFromDir(dir, listener) {
	const eventsPath = path.join(`${__dirname}/events`, dir);
	const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

	for (const file of eventFiles) {
		const filePath = path.join(eventsPath, file);
		let event = await import(filePath);
		event = event.default;
		if (event.once) {
			listener.once(event.name, (...args) => event.execute(...args, client));
		}
		else {
			listener.on(event.name, (...args) => event.execute(...args, client));
		}
	}
}