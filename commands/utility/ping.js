const { oneLine } = require('common-tags');
const { Command } = require('discord.js-commando');
const SelfReloadJSON = require('self-reload-json');
const blacklist = require('../../blacklist');
module.exports = class PingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ping',
			group: 'util',
			memberName: 'ping',
			description: 'Checks the bot\'s ping to the Discord server.',
			throttling: {
				usages: 5,
				duration: 10
			}
		});
	}

	async run(message) {
        let blacklistJson = new SelfReloadJSON('json/blacklist.json');
        if(blacklistJson[message.author.id])
		return blacklist(blacklistJson[message.author.id] , message)
		
		if(!message.editable) {
			const pingMsg = await message.say('Pinging...');
			return pingMsg.edit(oneLine`
				${message.channel.type !== 'dm' ? `${message.author},` : ''}
				<:ping:499226870047571978> Pong! The message round-trip took **${pingMsg.createdTimestamp - message.createdTimestamp}**ms.
				${this.client.ping ? `The heartbeat ping is **${Math.round(this.client.ping)}**ms.` : ''}
			`);
		} else {
			await message.edit('Pinging...');
			return message.edit(oneLine`
				Pong! The message round-trip took **${message.editedTimestamp - message.createdTimestamp}**ms.
				${this.client.ping ? `The heartbeat ping is **${Math.round(this.client.ping)}**ms.` : ''}
			`);
		}
	}
};
