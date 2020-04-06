const { Command } = require('discord-akairo');
const commandblock = require('../../models').commandBlock;

class commandblockCommand extends Command {
	constructor() {
		super('commandblock', {
			aliases: ['commandblock', 'blockcommand'],
			category: 'admin',
			args: [
				{
					id: 'command',
					type: 'command',
					prompt: {
						start: 'What command do you want to block?',
						retry: 'Not a valid command, please try again'
					}
				}
			],
			clientPermissions: ['SEND_MESSAGES'],
			userPermissions: ['ADMINISTRATOR'],
			channel: 'guild',
			description: {
				content: 'Block a command. Execute that command again to unblock a command',
				usage: '[command name]',
				examples: ['owned']
			}
		});
	}

	async exec(message, args) {
		if (args.command.id == 'commandblock') return message.channel.send('Whoa there, i can\'t let you block this command or else how would you unblock it?');

		const blocked = await commandblock.findOne({where: {serverID: message.guild.id, command: args.command.id}});

		if (!blocked) {
			const body = {serverID: message.guild.id, command: args.command.id};
			commandblock.create(body);
			return message.channel.send(`Blocked command ${args.command.id}`);
		} else {
			commandblock.destroy({where: {serverID: message.guild.id, command: args.command.id}});
			return message.channel.send(`The command ${args.command.id} has been unblocked`);
		}
	}
}
module.exports = commandblockCommand;