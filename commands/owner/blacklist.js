const { Command } = require('discord-akairo');
const userBlacklist = require('../../models').userBlacklist;

class userBlacklistCommand extends Command {
	constructor() {
		super('userBlacklist', {
			aliases: ['userblacklist', 'ublacklist'],
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
			return message.channel.send(`The following ID have been blacklisted globally: ${args.userID}`);
		} else {
			message.channel.send('This user is already blacklisted, do you want to unblacklist him? y/n');
			const filter = m =>  m.content && m.author.id === message.author.id;
			message.channel.awaitMessages(filter, {time: 5000 * 1000, max: 1, errors: ['time'] })
				.then(messages => {
					console.log(messages);
					let messageContent = messages.map(messages => messages.content);
					console.log(messageContent);
					if (messageContent[0] === 'y' || messageContent[0] === 'yes') {
						userBlacklist.destroy({where: {userID:args.userID}});
						return message.channel.send(`The following ID have been unblacklisted globally: ${args.userID}`);
					}
				})
				.catch(err => {
					console.error(err);
					return message.channel.send('Took too long to answer. didin\'t unblacklist anyone.');
				});
		}
	}
}

module.exports = userBlacklistCommand;