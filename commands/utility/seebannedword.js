const { Command } = require('discord-akairo');
const BannedWords = require('../../models').bannedWords;


class seebannedwordCommand extends Command {
	constructor() {
		super('seebannedword', {
			aliases: ['seebannedword', 'seeban', 'seebanword'],
			category: 'utility',
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
			channel: 'guild',
			description: {
				content: 'Show the list of banned word',
				usage: '',
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
		
		const Embed = this.client.util.embed()
			.setColor(message.member.displayHexColor)
			.setTitle('List of banned words')
			.setDescription(list);
	
		return message.channel.send(Embed);
	}
}
module.exports = seebannedwordCommand;