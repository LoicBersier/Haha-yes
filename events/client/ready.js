import { exec } from 'node:child_process';
const { statusChannel, NODE_ENV } = process.env;
import { version } from 'discord.js';

export default {
	name: 'ready',
	once: true,
	async execute(client) {
		// Init global variables.
		global.boards = {};

		const ytdlpVersion = await new Promise((resolve, reject) => {
			exec('./bin/yt-dlp --version', (err, stdout, stderr) => {
				if (err) {
					reject(stderr);
				}
				if (stderr) {
					console.error(stderr);
				}
				resolve(stdout);
			});
		});

		const commandSize = client.commands.size;
		const clientTag = client.user.username;
		const guildSize = client.guilds.cache.size;
		const channelSize = client.channels.cache.size;
		const clientID = client.user.id;

		console.log('===========[ READY ]===========');
		console.log(`\x1b[32mLogged in as \x1b[34m${clientTag}\x1b[0m! (\x1b[33m${clientID}\x1b[0m)`);
		console.log(`Ready to serve in \x1b[33m${channelSize}\x1b[0m channels on \x1b[33m${guildSize}\x1b[0m servers.`);
		console.log(`${client.readyAt}`);
		console.log(`There is \x1b[33m${commandSize}\x1b[0m command loaded.`);
		console.log(`Running yt-dlp \x1b[33m${ytdlpVersion.replace('\n', '')}\x1b[0m`);
		console.log(`Running Discord.js \x1b[33m${version}\x1b[0m`);
		console.log('===========[ READY ]===========');

		// If stats channel settings exist, send bot stats to it
		if (statusChannel && NODE_ENV !== 'development') {
			const channel = client.channels.resolve(statusChannel);
			channel.send(
				`Ready to serve in ${channelSize} channels on ${guildSize} servers.\n` +
				`There is ${commandSize} command loaded.\n` +
				`Running yt-dlp ${ytdlpVersion.replace('\n', '')}\n` +
				`${client.readyAt}`);
		}
	},
};