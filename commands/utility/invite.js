const { Command } = require('discord-akairo');
const { supportServer } = require('../../config.json');

class InviteCommand extends Command {
	constructor() {
		super('invite', {
			aliases: ['invite'],
			category: 'utility',
			clientPermissions: ['SEND_MESSAGES'],
			args: [
				{
					id: 'here',
					match: 'flag',
					flag: '--here'
				},
				{
					id: 'member',
					type: 'user'
				}
			],
			description: {
				content: 'Send invite link for the bot and support server\nCan also show the invite for other bot if you mention him',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message, args) {
		if (args.member) {
			if (args.member.bot) {
				return message.channel.send(`You can add the bot you mentioned with this link: https://discordapp.com/oauth2/authorize?client_id=${args.member.id}&scope=bot&permissions=0\n\`Note: The invite might not work if the bot is not public\``);
			} else {
				return message.channel.send('Sorry, the user you mentioned is not a bot!');
			}
		} else {
			let invMessage = `You can add me from here: https://discordapp.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot&permissions=0\nYou can also join my support server over here: ${supportServer} come and say hi :)`;
			if (args.here) {
				message.channel.send(invMessage);
			} else {
				message.channel.send('Check your dm');
				return message.author.send(invMessage);
			}
		}
	}
}

module.exports = InviteCommand;