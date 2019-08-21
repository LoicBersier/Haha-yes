const { Command } = require('discord-akairo');
const BannedWords = require('../../models').bannedWords;
const { MessageEmbed } = require('discord.js');


class seebannedwordCommand extends Command {
	constructor() {
		super('seebannedword', {
			aliases: ['seebannedword', 'seeban', 'seebanword'],
			category: 'utility',
			channelRestriction: 'guild',
			description: {
				content: 'Show the list of tag for this server. --all to get a txt file with info about every tag on the server',
				usage: '[name of tag]',
				examples: ['']
			}
		});
	}

	async exec(message) {
		const bannedWords = await BannedWords.findAll({where: {serverID: message.guild.id}});
		let list;
		for (let i = 0; i < bannedWords.length; i++) {
			if (i == 0) {
				list = bannedWords[i].get('word');
			} else {
				list = list + ' | ' + bannedWords[i].get('word');
			}
		}

		if (list == undefined) return message.channel.send('No word are banned yet.');
		
		const Embed = new MessageEmbed()
			.setColor('#ff9900')
			.setTitle('List of banned words')
			.setDescription(list);
	
		return message.channel.send(Embed);
	}
}
module.exports = seebannedwordCommand;