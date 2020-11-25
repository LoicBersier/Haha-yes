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
			.setColor(message.member ? message.member.displayHexColor : 'NAVY')
			.setTitle('Donation link')
			.setDescription('If you decide to donate, please use the feedback command to let the owner know about it so he can put you in the about and donator command\n[Paypal](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=KEMESDXL8Q5YY&source=url)\nYou can give [BAT token](https://namejeff.xyz) on my website');

		return message.channel.send(Embed);
	}
}

module.exports = donateCommand;