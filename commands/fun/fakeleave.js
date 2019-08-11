const { Command } = require('discord-akairo');
const fs = require('fs');
const rand = require('../../rand.js');

class fakeleaveCommand extends Command {
	constructor() {
		super('fakeleave', {
			aliases: ['fakeleave'],
			category: 'admin',
			channelRestriction: 'guild',
			args: [
				{
					id: 'member',
					type: 'member',
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
		if (fs.existsSync(`./bye/${message.guild.id}.json`)) {
			let member;
			if (args.member) {
				member = args.member.username;
			} else {
				member = message.author.username;
			}

			let bye = require(`../../bye/${message.guild.id}.json`);

			const channel = this.client.channels.get(bye['channel']);

			let byeMessage = bye['message'];

			byeMessage = byeMessage.replace(/\[member\]/, member);
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
			return message.channel.send('The server need a leave message first!');
		}
	}
}

module.exports = fakeleaveCommand;