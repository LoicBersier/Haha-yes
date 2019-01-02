const { Command } = require('discord-akairo');

class UnbanCommand extends Command {
	constructor() {
		super('unban', {
			aliases: ['unban'],
			category: 'admin',
			args: [
				{
					id: 'member',
					type: 'user'
				}
			],
			clientPermissions: ['BAN_MEMBERS'],
			userPermissions: ['BAN_MEMBERS'],
			channelRestriction: 'guild',
			description: {
				content: 'unban users',
				usage: '[user id]',
				examples: ['267065637183029248']
			}
		});
	}

	async exec(message, args) {
		message.guild.unban(args.member)
			.then(() => message.reply('user was succesfully unbanned.'));
	}
}

module.exports = UnbanCommand;