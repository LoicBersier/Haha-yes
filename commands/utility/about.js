const { Command } = require('discord-akairo');
const donator = require('../../models').donator;
const util = require('util');
const exec = util.promisify(require('child_process').exec);

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

		let description = `This bot is made using [discord.js](https://github.com/discordjs/discord.js) & [Discord-Akairo](https://github.com/discord-akairo/discord-akairo)\nHelp command from [hoshi](https://github.com/1Computer1/hoshi)\n[Rantionary](https://github.com/RantLang/Rantionary) for their dictionnary.\nThanks to ${this.client.users.resolve('336492042299637771').username}#${this.client.users.resolve('336492042299637771').discriminator} (336492042299637771) for inspiring me for making this bot!\n\nThe people who donated for the bot <3\n`;
		
		if (Donator[0]) {
			for (let i = 0; i < Donator.length; i++) {
				description += `**${this.client.users.resolve(Donator[i].get('userID')).username}#${this.client.users.resolve(Donator[i].get('userID')).discriminator} (${Donator[i].get('userID')}) | ${Donator[i].get('comment')}**\n`;
			}
		} else {
			description += 'No one :(';
		}

		exec('git rev-parse --short HEAD')
			.then(out => {
				console.log(out);
				const aboutEmbed = this.client.util.embed()
					.setColor(message.member ? message.member.displayHexColor : 'NAVY')
					.setAuthor(this.client.user.username, this.client.user.avatarURL())
					.setTitle('About me')
					.setDescription(description)
					.addField('Current commit', out.stdout)
					.addField('Current owner: ', `${this.client.users.resolve(this.client.ownerID).username}#${this.client.users.resolve(this.client.ownerID).discriminator} (${this.client.ownerID})`)
					.addField('Gitlab', 'https://gitlab.com/LoicBersier/DiscordBot', true)
					.addField('Github', 'https://github.com/loicbersier/Haha-yes', true)
					.setFooter(`Original bot made by ${this.client.users.resolve('267065637183029248').username}#${this.client.users.resolve('267065637183029248').discriminator} (267065637183029248)`); // Please don't change the "original bot made by"

				message.channel.send(aboutEmbed);
			});
	}
}

module.exports = aboutCommand;