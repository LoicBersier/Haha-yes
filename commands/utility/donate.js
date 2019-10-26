const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class donateCommand extends Command {
	constructor() {
		super('donate', {
			aliases: ['donate', 'donation', 'giveallmymoney', 'givemoney'],
			category: 'utility',
			description: {
				content: 'Send donate link for the bot and support server',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message) {
		const Embed = new MessageEmbed()
			.setColor('#ff9900')
			.setTitle('Donation link')
			.setDescription('[Paypal](https://www.paypal.me/supositware)\n[Patreon](https://www.patreon.com/bePatron?u=15330358)');

		message.channel.send(Embed);
	}
}

module.exports = donateCommand;