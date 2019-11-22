const { Command } = require('discord-akairo');
const fetch = require('node-fetch');

class AdviceCommand extends Command {
	constructor() {
		super('advice', {
			aliases: ['advice'],
			category: 'general',
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
			description: {
				content: 'Send some random advices',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message) {
		fetch('http://api.adviceslip.com/advice').then((response) => {
			return response.json();
		}).then((response) => {
			const adviceEmbed = this.client.util.embed()
				.setColor(message.member.displayHexColor)
				.setTitle(response.slip.slip_id)
				.setDescription(response.slip.advice);
  
  
			message.channel.send(adviceEmbed);
	
		});
	}
}
module.exports = AdviceCommand;