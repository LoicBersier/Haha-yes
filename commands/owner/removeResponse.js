const { Command } = require('discord-akairo');
const autoResponse = require('../../models').autoresponse;

class removeResponseCommand extends Command {
	constructor() {
		super('removeResponse', {
			aliases: ['removeResponse'],
			category: 'admin',
			split: 'none',
			userPermissions: ['MANAGE_MESSAGES'],
			args: [
				{
					id: 'trigger',
					type: 'string',
					match: 'rest',
					prompt: {
						start: 'wich tag do you want to remove?',
					}
				}
			],
			channelRestriction: 'guild',
			description: {
				content: 'Remove created custom autoresponse',
				usage: '[trigger]',
				examples: ['do you know da wea']
			}
		});
	}

	async exec(message, args) {
		const autoresponse = await autoResponse.findOne({where: {trigger: args.trigger, serverID: message.guild.id}});
		if (autoresponse) {
			autoResponse.destroy({where: {trigger: args.trigger}});
			return message.channel.send('Sucesffuly deleted the following autoresponse: ' + args.trigger);
		} else {
			return message.channel.send('Did not find the specified autoresponse, are you sure it exist?');
		}
	}
}

module.exports = removeResponseCommand;