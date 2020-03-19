const { Command } = require('discord-akairo');
const userBlacklist = require('../../models').userBlacklist;

class blacklistCommand extends Command {
	constructor() {
		super('blacklist', {
			aliases: ['blacklist'],
			category: 'owner',
			ownerOnly: 'true',
			userPermissions: ['MANAGE_MESSAGES'],
			args: [
				{
					id: 'userID',
					type: 'string',
					prompt: {
						start: 'Who do you want to blacklist?',
					}
				}
			],
			channel: 'guild',
			description: {
				content: 'Blacklist user from the bot',
				usage: '[userID]',
				examples: ['']
			}
		});
	}

	async exec(message, args) {
		const blacklist = await userBlacklist.findOne({where: {userID:args.userID}});
		
		if (!blacklist) {
			const body = {userID: args.userID};
			userBlacklist.create(body);
			return message.channel.send(`The following user have been blacklisted: ${this.client.users.resolve(args.userID).username}#${this.client.users.resolve(args.userID).discriminator} (${args.userID})`);
		} else {
			message.channel.send('This user is already blacklisted, do you want to unblacklist him? y/n');
			const filter = m =>  m.content && m.author.id == message.author.id;
			message.channel.awaitMessages(filter, {time: 5000 * 1000, max: 1, errors: ['time'] })
				.then(messages => {
					let messageContent = messages.map(messages => messages.content);
					if (messageContent == 'y' || messageContent == 'yes') {
						userBlacklist.destroy({where: {userID:args.userID}});
						return message.channel.send(`The following user have been unblacklisted: ${this.client.users.resolve(args.userID).username}#${this.client.users.resolve(args.userID).discriminator} (${args.userID})`);
					}
				})
				.catch(err => {
					console.error(err);
					return message.channel.send('Took too long to answer. didin\'t unblacklist anyone.');
				});
		}
	}
}

module.exports = blacklistCommand;