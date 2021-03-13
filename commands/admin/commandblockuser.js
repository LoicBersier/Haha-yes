const { Command } = require('discord-akairo');
const commandblockuser = require('../../models').commandblockuser;

class commandblockuserCommand extends Command {
	constructor() {
		super('commandblockuser', {
			aliases: ['commandblockuser', 'userblockcommand'],
			category: 'admin',
			args: [
				{
					id: 'command',
					type: 'command',
					prompt: {
						start: 'What command do you want to block?',
						retry: 'Not a valid command, please try again'
					}
				},
				{
					id: 'user',
					type: 'user',
					prompt: {
						start: 'Which user you want to block?'
					}
				}
			],
			clientPermissions: ['SEND_MESSAGES'],
			userPermissions: ['ADMINISTRATOR'],
			channel: 'guild',
			description: {
				content: 'Block a command from a user. Execute that command again to unblock a command',
				usage: '[command name] [@user]',
				examples: ['owned @supositware']
			}
		});
	}

	async exec(message, args) {
		if (args.command.id == 'commandblockuser') return message.channel.send('Whoa there, i can\'t let you block this command or else how would you unblock it?');

		const blocked = await commandblockuser.findOne({where: {serverID: message.guild.id, userID: args.user.id, command: args.command.id}});

		if (!blocked) {
			const body = {serverID: message.guild.id, userID: args.user.id, command: args.command.id};
			commandblockuser.create(body);
			return message.channel.send(`Blocked command ${args.command.id}`);
		} else {
			commandblockuser.destroy({where: {serverID: message.guild.id, userID: args.user.id, command: args.command.id}});
			return message.channel.send(`The command ${args.command.id} has been unblocked`);
		}
	}
}
module.exports = commandblockuserCommand;