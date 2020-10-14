const { Command } = require('discord-akairo');
const whitelistWord = require('../../models').whitelistWord;


class seewhitelistedCommand extends Command {
	constructor() {
		super('seewhitelistedword', {
			aliases: ['seewhitelistedword', 'seewhitelisted'],
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
		const WhitelistWord = await whitelistWord.findAll({where: {serverID: message.guild.id}});
		let list;
		for (let i = 0; i < WhitelistWord.length; i++) {
			if (i == 0) {
				list = WhitelistWord[i].get('word');
			} else {
				list = list + ' | ' + WhitelistWord[i].get('word');
			}
		}

		if (list == undefined) return message.channel.send('No word are whitelisted yet.');
		
		const Embed = this.client.util.embed()
			.setColor(message.member ? message.member.displayHexColor : 'NAVY')
			.setTitle('List of whitelisted words')
			.setDescription(list);
	
		return message.channel.send(Embed);
	}
}
module.exports = seewhitelistedCommand;