const { Command } = require('discord-akairo');
const fs = require('fs');

class shameboardCommand extends Command {
	constructor() {
		super('shameboard', {
			aliases: ['shameboard'],
			category: 'admin',
			channelRestriction: 'guild',
			userPermissions: ['MANAGE_CHANNELS'],
			args: [
				{
					id: 'emote',
					type: 'string',
					default: '✡'
				},
				{
					id: 'count',
					type: 'integer',
					default: '4'
				}
			],
			description: {
				content: 'Set shameboard',
				usage: '[]',
				examples: ['']
			}
		});
	}

	async exec(message, args) {
		let shameboardChannel = message.channel.id;

		fs.writeFile(`./board/shame${message.guild.id}.json`, `{"shameboard": "${shameboardChannel}" , "emote": "${args.emote}", "count": "${args.count}"}`, function (err) {
			if (err) {
				console.log(err);
			}
		});
		
		return message.channel.send(`This channel have been set as the shameboard with ${args.emote} with the minium of ${args.count}`);
	}
}

module.exports = shameboardCommand;