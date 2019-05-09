const { Listener } = require('discord-akairo');
const reload = require('auto-reload');
const rand = require('../../rand.js');

class guildMemberAddListener extends Listener {
	constructor() {
		super('guildMemberAdd', {
			emitter: 'client',
			event: 'guildMemberAdd'
		});
	}

	async exec(guild) {
		let welcome = reload(`../../welcome/${guild.guild.id}.json`);

		const channel = this.client.channels.get(welcome['channel']);

		let welcomeMessage = welcome['message'];

		welcomeMessage = welcomeMessage.replace(/\[member\]/, guild.user.username);
		welcomeMessage = welcomeMessage.replace(/\[server\]/, guild.guild.name);

		let attach;
		if (welcomeMessage.includes('[attach:')) {
			attach = welcomeMessage.split(/(\[attach:.*?])/);
			for (let i = 0, l = attach.length; i < l; i++) {
				if (attach[i].includes('[attach:')) {
					attach = attach[i].replace('[attach:', '').slice(0, -1);
					i = attach.length;
				}
			}
			welcomeMessage = welcomeMessage.replace(/(\[attach:.*?])/, '');
		}

		welcomeMessage = rand.random(welcomeMessage);	


		if (attach) {
			return channel.send(welcomeMessage, {files: [attach]});
		} else {
			return channel.send(welcomeMessage);
		}
	}
}
module.exports = guildMemberAddListener;