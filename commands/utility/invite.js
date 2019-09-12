const { Command } = require('discord-akairo');
const { supportServer } = require('../../config.json');

class InviteCommand extends Command {
	constructor() {
		super('invite', {
			aliases: ['invite'],
			category: 'utility',
			args: [
				{
					id: 'member',
					type: 'user'
				},
				{
					id: 'here',
					match: 'flag',
					flag: '--here'
				}
			],
			description: {
				content: 'Send invite link for the bot and support server',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message, args) {
		let botid;
		if (args.member.bot) {
			botid = args.member.id;
		} else {
			botid = this.client.user.id;
		}

		let invMessage = `You can add me from here: https://discordapp.com/oauth2/authorize?client_id=${botid}&scope=bot&permissions=0\nYou can also join my support server over here: ${supportServer} come and say hi :)`;
		if (args.here) {
			message.channel.send(invMessage);
		} else {
			message.channel.send('Check your dm');
			return message.author.send(invMessage);
		}
	}
}

module.exports = InviteCommand;