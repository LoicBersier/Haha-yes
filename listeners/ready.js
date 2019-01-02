const { Listener } = require('discord-akairo');
const { prefix, statsChannel } = require('../config.json');


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
		//  Send stats to the 'stats' channel in the support server if its not the test bot
		if (this.client.user.id == 377563711927484418) {
			const channel = this.client.channels.get(statsChannel);
			channel.send(`Ready to serve in ${this.client.channels.size} channels on ${this.client.guilds.size} servers, for a total of ${this.client.users.size} users. ${this.client.readyAt}`);
			this.client.user.setActivity(`${prefix} feedback <feedback> to tell me what you think of the bot! | ${prefix} help`);
		}
	}
}

module.exports = ReadyListener;