const { Command } = require('discord-akairo');
const safe = require('safe-regex');
const BannedWords = require('../../models').bannedWords;

class BannedWordsCommand extends Command {
	constructor() {
		super('BannedWords', {
			aliases: ['bannedword', 'banword', 'unbanword', 'censor', 'uncensor', 'blacklistword', 'blacklist', 'unblacklist'],
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
			channel: 'guild',
			description: {
				content: 'Ban word on the server. use the unbanword alias to delete a banned word, unbanword alias and --removeaall to remove every banned word',
				usage: '[word to ban]',
				examples: ['owo']
			}
		});
	}

	async exec(message, args) {
		if (!safe(message.content)) return;
		
		if (!args.word) args.word = '';
		args.word = args.word.replace(/[\u0250-\ue007]/g, '');
		const bannedWords = await BannedWords.findOne({where: {word: args.word.toLowerCase(), serverID: message.guild.id}});

		if (message.util.parsed.alias == 'unbanword' || message.util.parsed.alias == 'uncensor' || message.util.parsed.alias == 'unblacklist' || args.remove || args.removeall) {
			if (args.removeall) {
				BannedWords.destroy({where: {serverID: message.guild.id}});
				return message.channel.send('The banned words have been reset.');
			}

			if (bannedWords) {
				BannedWords.destroy({where: {word: args.word.toLowerCase(), serverID: message.guild.id}});
				return message.channel.send(`The word ${args.word.toLowerCase()} is no longer banned`);
			} else {
				return message.channel.send('There was no word to unban');
			}
		}

		if (!args.word) return message.channel.send('Please specify a word to ban!');

		if (!bannedWords) {
			const body = {word: args.word.toLowerCase(), serverID: message.guild.id};
			await BannedWords.create(body);
			return message.channel.send(`The word ${args.word.toLowerCase()} has been banned`);
		} else {
			message.channel.send('This word is already banned');
		}
	}
}

module.exports = BannedWordsCommand;