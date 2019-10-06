const { Command } = require('discord-akairo');
const guildBlacklist = require('../../models').guildBlacklist;

class serverBlacklistCommand extends Command {
	constructor() {
		super('serverBlacklist', {
			aliases: ['serverblacklist', 'sBlacklist'],
			category: 'owner',
			ownerOnly: 'true',
			userPermissions: ['MANAGE_MESSAGES'],
			args: [
				{
					id: 'guildID',
					type: 'string',
					prompt: {
						start: 'Who do you want to blacklist?',
					}
				}
			],
			channelRestriction: 'guild',
			description: {
				content: 'Blacklist guild from the bot',
				usage: '[GuildID]',
				examples: ['']
			}
		});
	}

	async exec(message, args) {
		const blacklist = await guildBlacklist.findOne({where: {guildID:message.author.id}});
		
		if (!blacklist) {
			const body = {guildID: args.guildID};
			guildBlacklist.create(body);
			return message.channel.send(`The guild with the following id have been blacklisted: ${args.guildID}`);
		} else {
			message.channel.send('This guild is already blacklisted, do you want to unblacklist it? y/n');
			const filter = m =>  m.content && m.author.id == message.author.id;
			message.channel.awaitMessages(filter, {time: 5000 * 1000, max: 1, errors: ['time'] })
				.then(messages => {
					let messageContent = messages.map(messages => messages.content);
					if (messageContent == 'y' || messageContent == 'yes') {
						guildBlacklist.destroy({where: {guildID:args.guildID}});
						return message.channel.send(`The guild with the following id have been unblacklisted: ${args.guildID}`);
					}
				})
				.catch(err => {
					console.error(err);
					return message.channel.send('Took too long to answer. didin\'t unblacklist anyone.');
				});
		}
	}
}

module.exports = serverBlacklistCommand;