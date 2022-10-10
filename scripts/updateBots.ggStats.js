import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { Client, GatewayIntentBits } from 'discord.js';


dotenv.config();
const { botsggToken, botsggEndpoint, token } = process.env;

const client = new Client({
	intents: [GatewayIntentBits.Guilds],
});
await client.login(token);

const body = {
	guildCount: client.guilds.cache.size,
};

console.log(body);

const response = await fetch(`${botsggEndpoint}/bots/${client.user.id}/stats`, {
	method: 'post',
	body: JSON.stringify(body),
	headers: { 'Authorization': botsggToken, 'Content-Type': 'application/json' },
});

const data = await response.json();

console.log(data);

process.exit();