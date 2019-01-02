const { Command } = require('discord-akairo');

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
		const upDoot = {
			color: 0x93C54B,
			title: 'Vote for my bot',
			url: 'https://discordbots.org/bot/377563711927484418/vote',
			description: 'You can vote for my bot if you think the bot is awesome!',
			timestamp: new Date(),
			footer: {
				text: 'Thanks for the updoots',
				icon_url: 'https://cdn.discordapp.com/avatars/377563711927484418/1335d202aa466dbeaa4ed2e4b616484a.png?size=2048',
			},
		};
		
		message.channel.send({ embed: upDoot });
	}
}

module.exports = UpdootCommand;