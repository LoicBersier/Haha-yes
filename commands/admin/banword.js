const { Command } = require('discord-akairo');
const BannedWords = require('../../models').bannedWords;

class BannedWordsCommand extends Command {
	constructor() {
		super('BannedWords', {
			aliases: ['bannedword', 'banword'],
			category: 'admin',
			userPermissions: ['MANAGE_MESSAGES'],
			clientPermissions: ['MANAGE_MESSAGES', 'SEND_MESSAGES'],
			args: [
				{
					id: 'word',
					type: 'string',
					match: 'rest'
				},
				{
					id: 'remove',
					match: 'flag',
					flag: '--remove'
				},
				{
					id: 'removeall',
					match: 'flag',
					flag: '--removeall'
				}
			],
			channelRestriction: 'guild',
			description: {
				content: 'Ban word on the server. --remove to delete a banned word. --removeaall to remove every banned word',
				usage: '[word to ban]',
				examples: ['owo']
			}
		});
	}

	async exec(message, args) {
		if (args.removeall) {
			BannedWords.destroy({where: {serverID: message.guild.id}});
			return message.channel.send('The banned word have been reset.');
		}
		
		if (!args.word) return message.channel.send('Please specify a word to ban!');

		args.word = args.word.replace(/[\u0250-\ue007]/g, '');
		const bannedWords = await BannedWords.findOne({where: {word: args.word.toLowerCase(), serverID: message.guild.id}});

		if (!bannedWords) {
			const body = {word: args.word.toLowerCase(), serverID: message.guild.id};
			await BannedWords.create(body);
			return message.channel.send(`The word ${args.word.toLowerCase()} have been banned`);
		} else if (args.remove && bannedWords) {
			BannedWords.destroy({where: {word: args.word.toLowerCase(), serverID: message.guild.id}});
			return message.channel.send(`The word ${args.word.toLowerCase()} is no longer banned`);
		} else {
			message.channel.send('This word is already banned');
		}
	}
}

module.exports = BannedWordsCommand;