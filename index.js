import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();
const { token, NODE_ENV } = process.env;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMembers],
	partials: [Partials.Message, Partials.Reaction, Partials.Channel],
	shards: 'auto',
});

// Load commands
client.commands = new Collection();

fs.readdir(`${__dirname}/commands`, (err, categoryPath) => {
	if (err) {
		return console.error(err);
	}
	categoryPath.forEach(category => {
		loadCommandFromDir(category);
	});
});

// Load events
loadEventFromDir('client', client);
if (NODE_ENV !== 'development') {
	loadEventFromDir('process', process);
}

client.login(token);

async function loadCommandFromDir(dir) {
	const commandsPath = path.join(`${__dirname}/commands`, dir);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		let command = await import(filePath);
		command = command.default;

		client.commands.set(command.data.name, command);
		console.log(`Successfully loaded command \x1b[32m${command.category}/${command.data.name}\x1b[0m`);
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
