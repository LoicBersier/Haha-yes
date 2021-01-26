const { Command } = require('discord-akairo');
const { donations } = require('../../config.json');

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
		if (donations === undefined) return message.channel.send('No donations has been setup on that bot.');

		let desc = 'If you decide to donate, please use the feedback command to let the owner know about it so he can put you in the about and donator command.';

		donations.forEach(m => {
			desc += `\n${m}`;
		});

		const Embed = this.client.util.embed()
			.setColor(message.member ? message.member.displayHexColor : 'NAVY')
			.setTitle('Donation link')
			.setDescription(desc);

		return message.channel.send(Embed);
	}
}

module.exports = donateCommand;