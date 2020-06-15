const { Command } = require('discord-akairo');
const cleverbot = require('cleverbot-free');
let conversation = {};

class CleverBotCommand extends Command {
	constructor() {
		super('CleverBot', {
			aliases: ['CleverBot', 'cb'],
			category: 'fun',
			clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
			args: [
				{
					id: 'message',
					type: 'string',
					prompt: {
						start: 'What do you want to say to cleverbot?'
					},
					match: 'rest'
				},
			],
			description: {
				content: 'Talk to cleverbot!',
				usage: '[message]',
				examples: ['Hello']
			}
		});
	}

	async exec(message, args) {
		let loadingmsg = await message.channel.send('Processing! <a:loadingmin:527579785212329984>');
		if (!conversation[message.guild.id]) conversation[message.guild.id] = [];


		if (!conversation[0]) {
			cleverbot(args.message).then(response => {
				conversation[message.guild.id].push(args.message);
				conversation[message.guild.id].push(response);
				return message.channel.send(response);
			});
		} else {
			cleverbot(args.message, conversation[message.guild.id]).then(response => {
				conversation[message.guild.id].push(args.message);
				conversation[message.guild.id].push(response);
				return message.channel.send(response);
			});
		}
		console.log(conversation);
		loadingmsg.delete();
	}
}
module.exports = CleverBotCommand;