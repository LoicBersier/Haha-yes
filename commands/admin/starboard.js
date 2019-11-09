const { Command } = require('discord-akairo');
const fs = require('fs');

class StarBoardCommand extends Command {
	constructor() {
		super('starboard', {
			aliases: ['starboard'],
			category: 'admin',
			channelRestriction: 'guild',
			userPermissions: ['MANAGE_CHANNELS'],
			args: [
				{
					id: 'emote',
					type: 'string',
					prompt: {
						start: 'What emote should be used to enter the shameboard?',
					},
				},
				{
					id: 'count',
					type: 'integer',
					prompt: {
						start: 'How many times should that emote be reacted to enter the shameboard?',
						optional: true
					},
					default: '4'
				},
				{
					id: 'remove',
					match: 'flag',
					flag: '--remove'
				}
			],
			description: {
				content: 'Set starboard to the current channel. --remove to remove the starboard',
				usage: '[emote] [minimum number required to enter starboard]',
				examples: ['']
			}
		});
	}

	async exec(message, args) {
		if (!args.remove) {
			let starboardChannel = message.channel.id;

			fs.writeFile(`./board/star${message.guild.id}.json`, `{"starboard": "${starboardChannel}", "emote": "${args.emote}", "count": "${args.count}"}`, function (err) {
				if (err) {
					console.log(err);
				}
			});
			
			return message.channel.send(`This channel have been set as the starboard with ${args.emote} with the minimum of ${args.count}`);
		} else {
			fs.unlink(`./board/star${message.guild.id}.json`, function (err) {
				if (err) return message.channel.send('There is no shameboard');
				return message.channel.send('Deleted the starboard');
			});
		}
	}
}

module.exports = StarBoardCommand;