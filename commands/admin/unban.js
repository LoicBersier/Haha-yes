const { Command } = require('discord-akairo');

class UnbanCommand extends Command {
	constructor() {
		super('unban', {
			aliases: ['unban'],
			category: 'admin',
			args: [
				{
					id: 'member',
					type: 'integer',
					prompt: {
						start: 'which member do you want to unban?',
						retry: 'This doesn\'t look like an ID, please try again'
					}
				}
			],
			clientPermissions: ['BAN_MEMBERS'],
			userPermissions: ['BAN_MEMBERS'],
			channel: 'guild',
			description: {
				content: 'unban users',
				usage: '[user id]',
				examples: ['267065637183029248']
			}
		});
	}

	async exec(message, args) {
		message.guild.members.unban(args.member.toString())
			.then(() => {
				return message.reply('user was succesfully unbanned.');
			})
			.catch(() => {
				return message.reply('Could not unban this user, is he banned in the first place?');
			});
	}
}

module.exports = UnbanCommand;