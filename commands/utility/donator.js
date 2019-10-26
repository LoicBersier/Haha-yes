const { Command } = require('discord-akairo');

class donatorCommand extends Command {
	constructor() {
		super('donator', {
			aliases: ['donator'],
			category: 'utility',
			description: {
				content: 'All the people who donated for this bot <3',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message) {
		return message.channel.send(`Thanks to:\n${this.client.users.get('294160866268413952').username}#${this.client.users.get('294160866268413952').discriminator} (294160866268413952)\n${this.client.users.get('428387534842626048').username}#${this.client.users.get('428387534842626048').discriminator} (428387534842626048)`);
	}
}

module.exports = donatorCommand;