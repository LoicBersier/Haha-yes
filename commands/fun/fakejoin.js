const { Command } = require('discord-akairo');
const fs = require('fs');
const rand = require('../../rand.js');

class fakejoinCommand extends Command {
	constructor() {
		super('fakejoin', {
			aliases: ['fakejoin'],
			category: 'admin',
			channelRestriction: 'guild',
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
		if (fs.existsSync(`./welcome/${message.guild.id}.json`)) {
			let member;
			if (args.member) {
				member = args.member;
			} else {
				member = message.author.username;
			}

			let welcome = require(`../../welcome/${message.guild.id}.json`);

			const channel = this.client.channels.get(welcome['channel']);

			let byeMessage = welcome['message'];

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
			return message.channel.send('The server need a join message first!');
		}
	}
}

module.exports = fakejoinCommand;