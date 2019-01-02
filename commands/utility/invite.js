const { Command } = require('discord-akairo');
const { supportServer } = require('../../config.json');

class InviteCommand extends Command {
	constructor() {
		super('invite', {
			aliases: ['invite'],
			category: 'utility',
			description: {
				content: 'Send invite link for the bot and support server',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message) {
		message.channel.send('Check your dm')
		return message.author.send(`You can add me from here: https://discordapp.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot&permissions=0\nYou can also join my support server over here: ${supportServer} come and say hi :)`);
	}
}

module.exports = InviteCommand;