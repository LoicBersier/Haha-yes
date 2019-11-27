const { Command } = require('discord-akairo');
const joinChannel = require('../../models').joinChannel;
const rand = require('../../rand.js');

class fakejoinCommand extends Command {
	constructor() {
		super('fakejoin', {
			aliases: ['fakejoin'],
			category: 'admin',
			channelRestriction: 'guild',
			clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
			args: [
				{
					id: 'member',
					type: 'string',
					match: 'rest'
				}
			],
			description: {
				content: 'Fake join message',
				usage: '[text]',
				examples: ['Supositware']
			}
		});
	}

	async exec(message, args) {
		const join = await joinChannel.findOne({where: {guildID: message.guild.id}});

		if (join) {
			const channel = this.client.channels.get(join.get('channelID'));

			let welcomeMessage = join.get('message');

			welcomeMessage = welcomeMessage.replace(/\[member\]/, args.member);
			welcomeMessage = welcomeMessage.replace(/\[server\]/, message.guild.name);
	
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
	
			message.delete();
			if (attach) {
				return channel.send(welcomeMessage, {files: [attach]});
			} else {
				return channel.send(welcomeMessage);
			}
		} else {
			return message.channel.send('Are you sure this server have a join message?');
		}
	}
}

module.exports = fakejoinCommand;