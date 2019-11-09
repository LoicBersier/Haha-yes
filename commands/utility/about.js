const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { ownerID } = require('../../config.json');
const donator = require('../../models').donator;

class aboutCommand extends Command {
	constructor() {
		super('about', {
			aliases: ['about', 'credit'],
			category: 'utility',
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
			description: {
				content: 'About me ( the bot )',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message) {
		const Donator = await donator.findAll({order: ['id']});

		let description = `This bot is made using [discord.js](https://github.com/discordjs/discord.js) & [Discord-Akairo](https://github.com/discord-akairo/discord-akairo)\nHelp command from [hoshi](https://github.com/1Computer1/hoshi)\n[Rantionary](https://github.com/RantLang/Rantionary) for their dictionnary.\nThanks to ${this.client.users.get('336492042299637771').username}#${this.client.users.get('336492042299637771').discriminator} (336492042299637771) for inspiring me for making this bot!\n\nThe people who donated for the bot <3\n`;
		
		if (Donator[0]) {
			for (let i = 0; i < Donator.length; i++) {
				description += `**${this.client.users.get(Donator[i].get('userID')).username}#${this.client.users.get(Donator[i].get('userID')).discriminator} (${Donator[i].get('userID')}) | ${Donator[i].get('comment')}**\n`;
			}
		} else {
			description += 'No one :(';
		}


		const aboutEmbed = new MessageEmbed()
			.setColor(message.member.displayHexColor)
			.setAuthor(this.client.user.username, this.client.user.avatarURL())
			.setTitle('About me')
			.setURL('https://gitlab.com/LoicBersier/DiscordBot')
			.setDescription(description)
			.addField('Current owner: ', `${this.client.users.get(ownerID).username}#${this.client.users.get(ownerID).discriminator} (${ownerID})`)
			.setFooter(`Gitlab link in the title | Original bot made by ${this.client.users.get('267065637183029248').username}#${this.client.users.get('267065637183029248').discriminator} (267065637183029248)`); // Please don't change the "original bot made by"
				
		message.channel.send(aboutEmbed);
	}
}

module.exports = aboutCommand;