const { Listener } = require('discord-akairo');
const reload = require('auto-reload');
const rand = require('../../rand.js');

class guildMemberRemoveListener extends Listener {
	constructor() {
		super('guildMemberRemove', {
			emitter: 'client',
			event: 'guildMemberRemove'
		});
	}

	async exec(guild) {
		let bye = reload(`../../bye/${guild.guild.id}.json`);

		const channel = this.client.channels.get(bye['channel']);

		let byeMessage = bye['message'];

		byeMessage = byeMessage.replace(/\[member\]/, guild.user.username);
		byeMessage = byeMessage.replace(/\[server\]/, guild.guild.name);

		let attach;
		if (byeMessage.includes('[attach:')) {
			attach = byeMessage.split(/(\[attach:.*?])/);
			for (let i = 0, l = attach.length; i < l; i++) {
				if (attach[i].includes('[attach:')) {
					attach = attach[i].replace('[attach:', '').slice(0, -1);
					i = attach.length;
				}
			}
			byeMessage = byeMessage.replace(/(\[attach:.*?])/, '');
		}

		byeMessage = rand.random(byeMessage);	


		if (attach) {
			return channel.send(byeMessage, {files: [attach]});
		} else {
			return channel.send(byeMessage);
		}
	}
}
module.exports = guildMemberRemoveListener;