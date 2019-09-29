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
					prompt: {
						start: 'What emote should be used to enter the shameboard?',
						optional: true
					},
					default: '✡'
				},
				{
					id: 'count',
					prompt: {
						start: 'How many times should that emote be reacted to enter the shameboard?',
						optional: true
					},
					type: 'integer',
					default: '4'
				},
				{
					id: 'remove',
					match: 'flag',
					flag: '--remove'
				}
			],
			description: {
				content: 'Set shameobard --remove to remove the shameboard',
				usage: '[emote] [minimum number required to enter shameboard]',
				examples: ['']
			}
		});
	}

	async exec(message, args) {
		if (!args.remove) {
			let shameboardChannel = message.channel.id;

			fs.writeFile(`./board/shame${message.guild.id}.json`, `{"shameboard": "${shameboardChannel}" , "emote": "${args.emote}", "count": "${args.count}"}`, function (err) {
				if (err) {
					console.log(err);
				}
			});
			
			return message.channel.send(`This channel have been set as the shameboard with ${args.emote} with the minimum of ${args.count}`);
		} else {
			fs.unlink(`./board/shame${message.guild.id}.json`, function (err) {
				if (err) return message.channel.send('There is no shameboard');
				return message.channel.send('Deleted the shameboard');
			});
		}
	}
}

module.exports = shameboardCommand;