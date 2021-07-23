const { Command } = require('discord-akairo');

class UpdootCommand extends Command {
	constructor() {
		super('updoot', {
			aliases: ['updoot', 'upvote', 'vote'],
			category: 'utility',
			channel: 'guild',
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
			description: {
				content: 'Send a link to vote for my bot',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message) {
		const upDoot = this.client.util.embed()
			.setColor(message.member ? message.member.displayHexColor : 'NAVY')
			.setTitle('Vote for my bot')
			.setAuthor(message.author.username)
			.setDescription('You can vote for my bot if you think it is awesome!')
			.addField('top.gg (Previously Discordbot.org)', 'https://top.gg/bot/377563711927484418/vote')
			.addField('Discordbotlist.com', 'https://discordbotlist.com/bots/haha-yes/upvote')
			.setTimestamp()
			.setFooter('Thanks for the updoots', this.client.user.avatarURL);
		
		message.reply({ embed: upDoot });
	}
}

module.exports = UpdootCommand;