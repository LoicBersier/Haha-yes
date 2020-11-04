const { Command } = require('discord-akairo');
const donator = require('../../models').donator;

class donatorCommand extends Command {
	constructor() {
		super('donator', {
			aliases: ['donator', 'donators'],
			category: 'utility',
			clientPermissions: ['SEND_MESSAGES'],
			description: {
				content: 'All the people who donated for this bot <3',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message) {
		const Donator = await donator.findAll({order: ['id']});

		let donatorMessage = 'Thanks to:\n';

		if (Donator[0]) {
			for (let i = 0; i < Donator.length; i++) {
				if (this.client.users.resolveID(Donator[i].get('userID').toString()) !== null)
					donatorMessage += `**${this.client.users.resolveID(Donator[i].get('userID').toString()).tag} (${Donator[i].get('userID')}) | ${Donator[i].get('comment')}**\n`;
				else
					donatorMessage += `**A user of discord (${Donator[i].get('userID')}) | ${Donator[i].get('comment')} (This user no longer share a server with the bot)**\n`;

			}
		} else {
			donatorMessage += 'No one :(';
		}

		return message.channel.send(donatorMessage);
	}
}

module.exports = donatorCommand;