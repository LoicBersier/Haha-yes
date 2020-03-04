const { Listener } = require('discord-akairo');
const akairoVersion = require('discord-akairo').version;
const djsVersion = require('discord.js').version;
const pjson = require('../../package.json');
const { prefix, statsChannel, ownerID, supportServer, exposeStats } = require('../../config.json');
const game = require('../../json/status/playing.json');
const watch = require('../../json/status/watching.json');


class ReadyListener extends Listener {
	constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready'
		});
	}

	async exec() {
		let commandSize = this.client.commandHandler.modules.size;
		let clientTag = this.client.user.tag;
		let guildSize = this.client.guilds.cache.size;
		let userSize = this.client.users.cache.size;
		let channelSize = this.client.channels.cache.size;
		let profilePicture = this.client.user.displayAvatarURL();
		let clientID = this.client.user.id;
		let author = this.client.users.resolve(ownerID).tag;


		//  Send stats to the console
		console.log('===========[ READY ]===========');
		console.log(`\x1b[32mLogged in as \x1b[34m${clientTag}\x1b[0m! (\x1b[33m${clientID}\x1b[0m)`);
		console.log(`Ready to serve in \x1b[33m${channelSize}\x1b[0m channels on \x1b[33m${guildSize}\x1b[0m servers, for a total of \x1b[33m${userSize}\x1b[0m users.`);
		console.log(`There is \x1b[33m${commandSize}\x1b[0m command loaded`);
		console.log(`${this.client.readyAt}`);

		//Bot status
		setStatus(this.client);
		// Change status every 30 minutes
		setInterval(async () => {
			setStatus(this.client);
		}, 1800000);

		async function setStatus(client) {
			let owner = client.users.resolve(client.ownerID);
			let random = Math.floor((Math.random() * 3));
			if (random == 0) { // Random "Watching" status taken from json
				console.log('Status type: \x1b[32mWatching\x1b[0m');
				
				let status = watch[Math.floor((Math.random() * watch.length))];
				status = status.replace('${prefix}', prefix[0]);
						
				client.user.setActivity(`${status} | My prefix is: ${prefix[0]} `, { type: 'WATCHING' });
			} else if (random == 1) { // Random "Playing" status taken from json
				console.log('Status type: \x1b[32mPlaying\x1b[0m');
				
				let status = game[Math.floor((Math.random() * game.length))];
				status = status.replace('${prefix}', prefix[0]);
						
				client.user.setActivity(`${status} | My prefix is: ${prefix[0]}`, { type: 'PLAYING' });
			} else if (random == 2 && owner.presence.activities != null) { // Bot owner status
				console.log('Status type: \x1b[32mCopying owner status\x1b[0m');
				// Get elapsed time from when the activity started		
				let diffMins = 0;
				if (owner.presence.activities[0].timestamps) {
					let diffMs = (new Date() - owner.presence.activities[0].timestamps.start);
					diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);					
				}
				client.user.setActivity(`${owner.presence.activities[0].name}\nfor ${diffMins} minutes | My prefix is: ${prefix[0]}`, owner.presence.activities[0]);
			} else { // Random user statuss
				console.log('Status type: \x1b[32mCopying random user status\x1b[0m');
				let randomuser = client.users.random();
				// If the random user have no activity or is a bot pick a new user
				while (randomuser.presence.activities[0] == null || randomuser.presence.activities[0].type == 'CUSTOM_STATUS' ||  randomuser.bot) {
					randomuser = client.users.random();
				}			

				// Get elapsed time from when the activity started		
				let diffMins = 0;
				if (randomuser.presence.activities[0].timestamps) {
					let diffMs = (new Date() - randomuser.presence.activities[0].timestamps.start);
					diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
				}

				client.user.setActivity(`${randomuser.username} is ${randomuser.presence.activities[0].type.toLowerCase()} ${randomuser.presence.activities[0].name}\nfor ${diffMins} minutes | My prefix is: ${prefix[0]}`, { type: randomuser.presence.activities[0].type, url: randomuser.presence.activities[0].url, name: randomuser.presence.activities[0].name });	
			}
		}


		// If stats channel settings exist, send bot stats to it
		if (statsChannel) {
			const channel = this.client.channels.resolve(statsChannel);
			channel.send(`Ready to serve in ${channelSize} channels on ${guildSize} servers, for a total of ${userSize} users.\nThere is ${commandSize} command loaded\n${this.client.readyAt}`);
		}

		// Expose stats
		if (exposeStats) {
			const port = 3000;

			const http = require('http');
	
			const requestHandler = (req, res) => {
				// Refresh some info
				commandSize = this.client.commandHandler.modules.size;
				guildSize = this.client.guilds.cache.size;
				userSize = this.client.users.cache.size;
				profilePicture = this.client.user.displayAvatarURL();
				
				let response = {
					'commandSize': commandSize,
					'ClientTag': clientTag,
					'guildSize': guildSize,
					'userSize': userSize,
					'prefixSize': prefix.length,
					'profilePicture': profilePicture,
					'clientID': clientID,
					'djsVersion': djsVersion,
					'akairoVersion': akairoVersion,
					'homepage': pjson.homepage,
					'author': author,
					'supportServer': supportServer
				};
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(response));
			};
			
			const server = http.createServer(requestHandler);
			
			server.listen(port, (err) => {
				if (err) {
					return console.log('something bad happened', err);
				}
			});
			console.log(`Exposing stats on port ${port}`);
		}

		console.log('===========[ READY ]===========');

	}
}

module.exports = ReadyListener;