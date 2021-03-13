const { Command } = require('discord-akairo');
const userBlacklist = require('../../models').userBlacklist;
const Blacklists = require('../../models').Blacklists;

class userBlacklistCommand extends Command {
	constructor() {
		super('userBlacklist', {
			aliases: ['userblacklist', 'ublacklist'],
			category: 'owner',
			ownerOnly: 'true',
			userPermissions: ['MANAGE_MESSAGES'],
			args: [
				{
					id: 'command',
					type: 'string',
					prompt: {
						start: 'Which command do you want to get a user blacklisted from?'
					}
				},
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
					match: 'rest',
					default: 'No reason specified.'
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
		const blacklist = await Blacklists.findOne({where: {type:args.command, uid:message.author.id}});

		if (!blacklist) {
			const body = {type:args.command, uid: args.userID, reason: args.reason};
			Blacklists.create(body);
			let user = this.client.users.resolve(args.userID);
			return message.channel.send(`${user.tag} has been blacklisted from ${args.command} with the following reason ${args.reason}`);
		} else {
			message.channel.send('This user is already blacklisted, do you want to unblacklist him? y/n');
			const filter = m =>  m.content && m.author.id === message.author.id;
			message.channel.awaitMessages(filter, {time: 5000 * 1000, max: 1, errors: ['time'] })
				.then(messages => {
					console.log(messages);
					let messageContent = messages.map(messages => messages.content);
					console.log(messageContent);
					if (messageContent[0] === 'y' || messageContent[0] === 'yes') {
						Blacklists.destroy({where: {type:args.command, uid:args.userID}});
						return message.channel.send(`The following ID have been unblacklisted from ${args.command}: ${args.userID}`);
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