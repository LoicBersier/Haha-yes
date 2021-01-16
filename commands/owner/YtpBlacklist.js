const { Command } = require('discord-akairo');
const ytpblacklist = require('../../models').ytpblacklist;

class ytpblacklistCommand extends Command {
	constructor() {
		super('ytpblacklist', {
			aliases: ['ytpblacklist', 'yblacklist'],
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
				},
				{
					id: 'reason',
					match: 'rest',
					type: 'string',
					default: 'no reasons provided',
					prompt: {
						start: 'What should the reason be?',
						optional: true,
					}
				}
			],
			channel: 'guild',
			description: {
				content: 'Blacklist user from the YTP command',
				usage: '[userID]',
				examples: ['']
			}
		});
	}

	async exec(message, args) {
		const blacklist = await ytpblacklist.findOne({where: {userID:args.userID}});
		
		if (!blacklist) {
			const body = {userID: args.userID, reason: args.reason};
			ytpblacklist.create(body);
			return message.channel.send(`The user with the following id have been blacklisted from the YTP: ${args.userID}`);
		} else {
			message.channel.send('This user is already blacklisted, do you want to unblacklist him? y/n');
			const filter = m =>  m.content && m.author.id === message.author.id;
			message.channel.awaitMessages(filter, {time: 5000 * 1000, max: 1, errors: ['time'] })
				.then(messages => {
					let messageContent = messages.map(messages => messages.content);
					if (messageContent[0] === 'y' || messageContent[0] === 'yes') {
						ytpblacklist.destroy({where: {userID:args.userID}});
						return message.channel.send(`The user with the following id have been unblacklisted from the YTP: ${args.userID}`);
					}
				})
				.catch(err => {
					console.error(err);
					return message.channel.send('Took too long to answer. didin\'t unblacklist anyone.');
				});
		}
	}
}

module.exports = ytpblacklistCommand;