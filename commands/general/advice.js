const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

class AdviceCommand extends Command {
	constructor() {
		super('advice', {
			aliases: ['advice'],
			category: 'general',
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
			const adviceEmbed = new MessageEmbed()				.setColor('#ff9900')
				.setTitle(response.slip.slip_id)
				.setDescription(response.slip.advice);
  
  
			message.channel.send(adviceEmbed);
	
		});
	}
}
module.exports = AdviceCommand;