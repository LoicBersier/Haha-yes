const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { ownerID } = require('../../config.json');

class aboutCommand extends Command {
	constructor() {
		super('about', {
			aliases: ['about', 'credit'],
			category: 'utility',
			description: {
				content: 'About me ( the bot )',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message) {
		const aboutEmbed = new MessageEmbed()
			.setColor('#ff9900')
			.setAuthor(`${this.client.users.get(ownerID).username}#${this.client.users.get(ownerID).discriminator} (${ownerID})`, this.client.user.avatarURL)
			.setTitle('About me')
			.setURL('https://gitlab.com/LoicBersier/DiscordBot')
			.setDescription(`This bot is made using [discord.js](https://github.com/discordjs/discord.js) & [Discord-Akairo](https://github.com/discord-akairo/discord-akairo)\nHelp command from [hoshi](https://github.com/1Computer1/hoshi)\n* [Rantionary](https://github.com/RantLang/Rantionary) for there dictionnary.\nThanks to Tina the Cyclops girl#5759 for inspiring me for making this bot!\n\nThe people who donated for the bot <3\n${this.client.users.get('294160866268413952').username}#${this.client.users.get('294160866268413952').discriminator} (294160866268413952)\n${this.client.users.get('428387534842626048').username}#${this.client.users.get('428387534842626048').discriminator} (428387534842626048)`)
			.setFooter(`Gitlab link in the title | Original bot made by ${this.client.users.get('267065637183029248').username}#${this.client.users.get('267065637183029248').discriminator} (267065637183029248)`);
				
		message.channel.send(aboutEmbed);
	}
}

module.exports = aboutCommand;