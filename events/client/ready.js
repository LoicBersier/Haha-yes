import { exec } from 'node:child_process';
import dotenv from 'dotenv';
dotenv.config();
const { statusChannel } = process.env;

export default {
	name: 'ready',
	once: true,
	async execute(client) {
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
		const clientTag = client.user.tag;
		const guildSize = client.guilds.cache.size;
		const channelSize = client.channels.cache.size;
		const clientID = client.user.id;

		console.log('===========[ READY ]===========');
		console.log(`\x1b[32mLogged in as \x1b[34m${clientTag}\x1b[0m! (\x1b[33m${clientID}\x1b[0m)`);
		console.log(`Ready to serve in \x1b[33m${channelSize}\x1b[0m channels on \x1b[33m${guildSize}\x1b[0m servers.`);
		console.log(`${client.readyAt}`);
		console.log(`There is \x1b[33m${commandSize}\x1b[0m command loaded.`);
		console.log(`Running yt-dlp \x1b[33m${ytdlpVersion.replace('\n', '')}\x1b[0m`);
		console.log('===========[ READY ]===========');

		// If stats channel settings exist, send bot stats to it
		if (statusChannel) {
			const channel = client.channels.resolve(statusChannel);
			channel.send(`Ready to serve in ${channelSize} channels on ${guildSize} servers.\nThere is ${commandSize} command loaded.\nRunning yt-dlp ${ytdlpVersion.replace('\n', '')}\n${client.readyAt}`);
		}
	},
};