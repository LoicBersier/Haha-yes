const { Listener } = require('discord-akairo');
const leaveChannel = require('../../models').leaveChannel;
const rand = require('../../rand.js');

class guildMemberRemoveListener extends Listener {
	constructor() {
		super('guildMemberRemove', {
			emitter: 'client',
			event: 'guildMemberRemove'
		});
	}

	async exec(guild) {
		const leave = await leaveChannel.findOne({where: {guildID: guild.id}});
		if (leave) {
			const channel = this.client.channels.get(leave.get('channelID'));

			let byeMessage = leave.get('message');

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
}
module.exports = guildMemberRemoveListener;