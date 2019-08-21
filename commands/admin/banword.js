const { Command } = require('discord-akairo');
const BannedWords = require('../../models').bannedWords;

class BannedWordsCommand extends Command {
	constructor() {
		super('BannedWords', {
			aliases: ['bannedword', 'banword'],
			category: 'admin',
			userPermissions: ['MANAGE_MESSAGES'],
			args: [
				{
					id: 'word',
					type: 'string',
					prompt: {
						start: 'What word should be banned',
					},
					match: 'rest'
				},
				{
					id: 'remove',
					match: 'flag',
					flag: '--remove'
				}
			],
			channelRestriction: 'guild',
			description: {
				content: 'Ban word on the server. --remove to delete a banned word',
				usage: '[word to ban]',
				examples: ['owo']
			}
		});
	}

	async exec(message, args) {
		const bannedWords = await BannedWords.findOne({where: {word: args.word, serverID: message.guild.id}});

		if (!bannedWords) {
			const body = {word: args.word, serverID: message.guild.id};
			await BannedWords.create(body);
			return message.channel.send(`The word ${args.word} have been banned`);
		} else if (args.remove && bannedWords) {
			BannedWords.destroy({where: {word: args.word, serverID: message.guild.id}});
			return message.channel.send(`The word ${args.word} is no longer banned`);
		} else {
			message.channel.send('This word is already banned');
		}
	}
}

module.exports = BannedWordsCommand;