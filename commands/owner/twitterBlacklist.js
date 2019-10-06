const { Command } = require('discord-akairo');
const TwitterBlacklist = require('../../models').TwitterBlacklist;

class TwitterBlacklistCommand extends Command {
	constructor() {
		super('TwitterBlacklist', {
			aliases: ['TwitterBlacklist', 'twiBlacklist', 'tblacklist'],
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
					type: 'string',
					default: 'no reasons provided',
					prompt: {
						start: 'What should the reason be?',
						optional: true,
					}
				}
			],
			channelRestriction: 'guild',
			description: {
				content: 'Create custom autoresponse',
				usage: '[trigger] [response]',
				examples: ['"do you know da wea" Fuck off dead meme', 'hello Hello [author], how are you today?']
			}
		});
	}

	async exec(message, args) {
		const blacklist = await TwitterBlacklist.findOne({where: {userID:args.userID}});
		
		if (!blacklist) {
			const body = {userID: args.userID, reason: args.reason};
			TwitterBlacklist.create(body);
			return message.channel.send(`The user with the following id have been blacklisted: ${args.userID}`);
		} else {
			message.channel.send('This user is already blacklisted, do you want to unblacklist him? y/n');
			const filter = m =>  m.content && m.author.id == message.author.id;
			message.channel.awaitMessages(filter, {time: 5000 * 1000, max: 1, errors: ['time'] })
				.then(messages => {
					let messageContent = messages.map(messages => messages.content);
					if (messageContent == 'y' || messageContent == 'yes') {
						TwitterBlacklist.destroy({where: {userID:args.userID}});
						return message.channel.send(`The user with the following id have been unblacklisted: ${args.userID}`);
					}
				})
				.catch(err => {
					console.error(err);
					return message.channel.send('Took too long to answer. didin\'t unblacklist anyone.');
				});
		}
	}
}

module.exports = TwitterBlacklistCommand;