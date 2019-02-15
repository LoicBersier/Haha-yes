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
					default: '🌟'
				},
				{
					id: 'count',
					type: 'integer',
					default: '4'
				}
			],
			description: {
				content: 'Set starboard',
				usage: '[]',
				examples: ['']
			}
		});
	}

	async exec(message, args) {
		let starboardChannel = message.channel.id;

		fs.writeFile(`./board/star${message.guild.id}.json`, `{"starboard": "${starboardChannel}", "emote": "${args.emote}", "count": "${args.count}"}`, function (err) {
			if (err) {
				console.log(err);
			}
		});
		
		return message.channel.send(`This channel have been set as the starboard with ${args.emote} with the minium of ${args.count}`);
	}
}

module.exports = StarBoardCommand;