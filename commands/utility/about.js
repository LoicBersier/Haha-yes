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

		let description = `This bot is made using [discord.js](https://github.com/discordjs/discord.js) & [Discord-Akairo](https://github.com/discord-akairo/discord-akairo)\nHelp command from [hoshi](https://github.com/1Computer1/hoshi)\n[Rantionary](https://github.com/RantLang/Rantionary) for their dictionnary.\nThanks to ${this.client.users.resolve('336492042299637771').tag} (336492042299637771) for inspiring me for making this bot!\n\nThe people who donated for the bot <3\n`;
		
		if (Donator[0]) {
			for (let i = 0; i < Donator.length; i++) {
				if (this.client.users.resolve(Donator[i].get('userID').toString()) !== null)
					description += `**${this.client.users.resolve(Donator[i].get('userID').toString()).tag} (${Donator[i].get('userID')}) | ${Donator[i].get('comment')}**\n`;
				else
					description += `**A user of discord (${Donator[i].get('userID')}) | ${Donator[i].get('comment')} (This user no longer share a server with the bot)**\n`;
			}
		} else {
			description += 'No one :(\n';
		}

		description += '\nThanks to Jetbrains for providing their IDE!';

		exec('git rev-parse --short HEAD')
			.then(out => {
				const aboutEmbed = this.client.util.embed()
					.setColor(message.member ? message.member.displayHexColor : 'NAVY')
					.setAuthor(this.client.user.username, this.client.user.avatarURL())
					.setTitle('About me')
					.setDescription(description)
					.addField('Current commit', out.stdout)
					.addField('Current owner: ', `${this.client.users.resolve(this.client.ownerID).tag} (${this.client.ownerID})`)
					.addField('Gitlab', 'https://gitlab.com/LoicBersier/DiscordBot', true)
					.addField('Github', 'https://github.com/loicbersier/Haha-yes', true)
					.setThumbnail('https://its.gamingti.me/ZiRe.png')
					.setFooter(`Original bot made by ${this.client.users.resolve('267065637183029248').tag} (267065637183029248)`); // Please this line

				message.channel.send(aboutEmbed);
			});
	}
}

module.exports = aboutCommand;