const { Command } = require('discord-akairo');
const quotationStat = require('../../models').quotationStat;

class quotationCommand extends Command {
	constructor() {
		super('quotation', {
			aliases: ['quotation'],
			category: 'admin',
			args: [
				{
					id: 'stat',
					type: 'string',
					prompt: {
						start: 'Do you want to **enable** or **disable** quotation?',
					}
				}
			],
			clientPermissions: ['SEND_MESSAGES'],
			userPermissions: ['MANAGE_MESSAGES'],
			channelRestriction: 'guild',
			description: {
				content: 'enable/disable quotation',
				usage: '[enable/disable]',
				examples: ['enable']
			}
		});
	}

	async exec(message, args) {
		if (args.stat.toLowerCase() == 'enable' || args.stat.toLowerCase() == 'disable') {
			const quotationstat = await quotationStat.findOne({where: {serverID: message.guild.id}});

			if (!quotationstat) {
				const body = {serverID: message.guild.id, stat: args.stat};
				quotationStat.create(body);
				return message.channel.send(`Quotation has been ${args.stat}d`);
			} else {
				const body = {serverID: message.guild.id, stat: args.stat};
				quotationStat.update(body, {where: {serverID: message.guild.id}});
				return message.channel.send(`Quotation has been ${args.stat}d`);
			}
		}
	}
}
module.exports = quotationCommand;