const { Command } = require('discord-akairo');
const autoResponseStat = require('../../models').autoresponseStat;

class autoresponseCommand extends Command {
	constructor() {
		super('autoresponse', {
			aliases: ['autoresponse'],
			category: 'admin',
			args: [
				{
					id: 'stat',
					type: 'string',
					prompt: {
						start: 'Do you want to **enable** or **disable** auto response?',
					}
				}
			],
			clientPermissions: ['SEND_MESSAGES'],
			userPermissions: ['MANAGE_MESSAGES'],
			channelRestriction: 'guild',
			description: {
				content: 'enable/disable autoresponse',
				usage: '[enable/disable]',
				examples: ['enable']
			}
		});
	}

	async exec(message, args) {
		if (args.stat.toLowerCase() == 'enable' || args.stat.toLowerCase() == 'disable') {
			const autoresponseStat = await autoResponseStat.findOne({where: {serverID: message.guild.id}});

			if (!autoresponseStat) {
				const body = {serverID: message.guild.id, stat: args.stat};
				autoResponseStat.create(body);
				return message.channel.send(`Autoresponse have been ${args.stat}d`);
			} else {
				const body = {serverID: message.guild.id, stat: args.stat};
				autoResponseStat.update(body, {where: {serverID: message.guild.id}});
				return message.channel.send(`Autoresponse have been ${args.stat}d`);
			}
		}
	}
}
module.exports = autoresponseCommand;