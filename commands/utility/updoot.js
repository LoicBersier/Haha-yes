const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class UpdootCommand extends Command {
	constructor() {
		super('updoot', {
			aliases: ['updoot', 'upvote', 'vote'],
			category: 'utility',
			channelRestriction: 'guild',
			description: {
				content: 'Send a link to vote for my bot',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message) {
		const upDoot = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Vote for my bot')
			.setURL('https://discordbots.org/bot/377563711927484418/vote')
			.setAuthor(message.author.username)
			.setDescription('You can vote for my bot if you think the bot is awesome!')
			.setTimestamp()
			.setFooter('Thanks for the updoots', 'https://cdn.discordapp.com/avatars/377563711927484418/1335d202aa466dbeaa4ed2e4b616484a.png?size=2048');
		
		message.channel.send({ embed: upDoot });
	}
}

module.exports = UpdootCommand;