const { Command } = require('discord-akairo');
const whitelistWord = require('../../models').whitelistWord;

class whitelistWordCommand extends Command {
	constructor() {
		super('whitelistWord', {
			aliases: ['whitelistWord', 'unwhitelistword', 'whitelist', 'unwhitelist'],
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
				content: 'Whitelist word so it is not affected by the banned word, unwhitelistword alias and --removeaall to remove every banned whitelisted word',
				usage: '[word to whitelist]',
				examples: ['sexuality']
			}
		});
	}

	async exec(message, args) {
		if (!args.word) args.word = '';
		args.word = args.word.replace(/[\u0250-\ue007]/g, '');
		const WhitelistWord = await whitelistWord.findOne({where: {word: args.word.toLowerCase(), serverID: message.guild.id}});

		if (message.util.parsed.alias == 'unwhitelistword' || message.util.parsed.alias == 'unwhitelist' || args.remove || args.removeall) {
			if (args.removeall) {
				whitelistWord.destroy({where: {serverID: message.guild.id}});
				return message.channel.send('The whitelisted words has been reset.');
			}

			if (WhitelistWord) {
				whitelistWord.destroy({where: {word: args.word.toLowerCase(), serverID: message.guild.id}});
				return message.channel.send(`The word ${args.word.toLowerCase()} is no longer whitelisted`);
			} else {
				return message.channel.send('There was no word to whiteliste');
			}
		}

		if (!args.word) return message.channel.send('Please specify a word to whiteliste!');

		if (!WhitelistWord) {
			const body = {word: args.word.toLowerCase(), serverID: message.guild.id};
			await whitelistWord.create(body);
			return message.channel.send(`The word ${args.word.toLowerCase()} has been whitelisted`);
		} else {
			message.channel.send('This word is already whitelisted');
		}
	}
}

module.exports = whitelistWordCommand;