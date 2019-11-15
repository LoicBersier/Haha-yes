const { Listener } = require('discord-akairo');
const { prefix, statsChannel, botID } = require('../../config.json');
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
		//  Send stats to the console
		console.log(`\x1b[32mLogged in as \x1b[34m${this.client.user.tag}\x1b[0m! (\x1b[33m${this.client.user.id}\x1b[0m)`);
		console.log(`Ready to serve in \x1b[33m${this.client.channels.size}\x1b[0m channels on \x1b[33m${this.client.guilds.size}\x1b[0m servers, for a total of \x1b[33m${this.client.users.size}\x1b[0m users. \x1b${this.client.readyAt}\x1b[0m`);

		//Bot status
		if (Math.floor((Math.random() * 2) + 1) == 1) {
			console.log('Status type: \x1b[32mWatching\x1b[0m');

			let status = watch[Math.floor((Math.random() * watch.length))];
			status = status.replace('${prefix}', prefix[0]);
		
			this.client.user.setActivity(`${status} | My prefix is: ${prefix[0]} `, { type: 'WATCHING' });
		} else {
			console.log('Status type: \x1b[32mPlaying\x1b[0m');

			let status = game[Math.floor((Math.random() * game.length))];
			status = status.replace('${prefix}', prefix[0]);
		
			this.client.user.setActivity(`${status} | My prefix is: ${prefix[0]}`, { type: 'PLAYING' });
		}

		//  Send stats to the 'stats' channel in the support server if its not the test bot
		if (this.client.user.id == botID) {
			const channel = this.client.channels.get(statsChannel);
			channel.send(`Ready to serve in ${this.client.channels.size} channels on ${this.client.guilds.size} servers, for a total of ${this.client.users.size} users.\n${this.client.readyAt}`);
		}
		/*
		//Fetch messages in every channel ( so they can still enter starboard in case of reboot)
		let array = [];
		let channels = this.client.channels.array();
		for (const channel of channels.values()) {
			array.push(channel.id);
		}
		
		for (let i = 0; i < this.client.channels.size; i++) {
			let channel = this.client.channels.get(array[i]);
			if (channel.messages) {
				channel.messages.fetch({ limit: 10 })
					.then(messages => console.log(`Received ${messages.size} messages`))
					.catch(err => console.error(err));
			}
		}	
		*/
	}
}

module.exports = ReadyListener;