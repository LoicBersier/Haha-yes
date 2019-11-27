const { Command } = require('discord-akairo');
const leaveChannel = require('../../models').leaveChannel;
const rand = require('../../rand.js');

class fakeleaveCommand extends Command {
	constructor() {
		super('fakeleave', {
			aliases: ['fakeleave'],
			category: 'admin',
			channelRestriction: 'guild',
			clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
			args: [
				{
					id: 'member',
					type: 'user',
					match: 'rest'
				}
			],
			description: {
				content: 'Fake leave message',
				usage: '[user]',
				examples: ['Supositware']
			}
		});
	}

	async exec(message, args) {
		const leave = await leaveChannel.findOne({where: {guildID: message.guild.id}});
		if (leave) {
			const channel = this.client.channels.get(leave.get('channelID'));

			let byeMessage = leave.get('message');

			byeMessage = byeMessage.replace(/\[member\]/, args.member.username);
			byeMessage = byeMessage.replace(/\[server\]/, message.guild.name);

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

			message.delete();
			if (attach) {
				return channel.send(byeMessage, {files: [attach]});
			} else {
				return channel.send(byeMessage);
			}
		} else {
			return message.channel.send('Are you sure this server have a leave message?');
		}
	}
}

module.exports = fakeleaveCommand;