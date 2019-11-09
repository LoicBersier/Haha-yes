const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class donateCommand extends Command {
	constructor() {
		super('donate', {
			aliases: ['donate', 'donation', 'giveallmymoney', 'givemoney'],
			category: 'utility',
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
			description: {
				content: 'Send donate link for the bot and support server',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message) {
		const Embed = new MessageEmbed()
			.setColor(message.member.displayHexColor)
			.setTitle('Donation link')
			.setDescription('If you decide to donate, please use the feedback command to let the owner know about it so he can put you in the about and donator command\n[Paypal](https://www.paypal.me/supositware)\n[Patreon](https://www.patreon.com/bePatron?u=15330358)');

		return message.channel.send(Embed);
	}
}

module.exports = donateCommand;