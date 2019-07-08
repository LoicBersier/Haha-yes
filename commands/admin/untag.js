const { Command } = require('discord-akairo');
const Tag = require('../../models').Tag;

class UnTagCommand extends Command {
	constructor() {
		super('untag', {
			aliases: ['untag', 'removetag', 'delete'],
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
		const tag = await Tag.findOne({where: {trigger: args.trigger, serverID: message.guild.id}});
		if (tag) {
			Tag.destroy({where: {trigger: args.trigger, serverID: message.guild.id}});
			return message.channel.send('Sucesffuly deleted the following tag: ' + args.trigger);
		} else {
			return message.channel.send('Did not find the specified tag, are you sure it exist?');
		}
	}
}

module.exports = UnTagCommand;