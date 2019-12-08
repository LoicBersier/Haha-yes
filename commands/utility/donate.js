const { Command } = require('discord-akairo');

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
		const Embed = this.client.util.embed()
			.setColor(message.member.displayHexColor)
			.setTitle('Donation link')
			.setDescription('If you decide to donate, please use the feedback command to let the owner know about it so he can put you in the about and donator command\n[Paypal](https://www.paypal.me/supositware)\n[Patreon](https://www.patreon.com/bePatron?u=15330358)\n[Brave referal program](https://brave.com/hah459)\nTip me with Brave BAT token on [my website](https://namejeff.xyz/)\nYou can also donate ETH to ``0xe188F9062A74cc29e23D0602F4Fe335B1F5D8409``');

		return message.channel.send(Embed);
	}
}

module.exports = donateCommand;