const { Command } = require('discord-akairo');
const leaveChannel = require('../../models').leaveChannel;

class fakeleaveCommand extends Command {
	constructor() {
		super('fakeleave', {
			aliases: ['fakeleave'],
			category: 'admin',
			channel: 'guild',
			clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
			args: [
				{
					id: 'user',
					type: 'user',
					match: 'rest'
				}
			],
			description: {
				content: 'Fake leave message',
				usage: '[user]',
				examples: ['Supositware']
			}
		});
	}

	async exec(message, args) {
		let member;
		const leave = await leaveChannel.findOne({where: {guildID: message.guild.id}});

		if (leave) {
			if (args.user)
				member = message.guild.members.resolve(args.user.id);
			else
				member = message.guild.members.resolve(message.author.id);
		} else {
			return message.reply('There is no leave channel setup');
		}

		this.client.emit('guildMemberRemove', member);
	}
}

module.exports = fakeleaveCommand;