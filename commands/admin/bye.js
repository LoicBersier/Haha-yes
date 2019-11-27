const { Command } = require('discord-akairo');
const leaveChannel = require('../../models').leaveChannel;

class byeCommand extends Command {
	constructor() {
		super('bye', {
			aliases: ['bye', 'leave'],
			category: 'admin',
			channelRestriction: 'guild',
			userPermissions: ['MANAGE_CHANNELS'],
			clientPermissions: ['SEND_MESSAGES'],
			args: [
				{
					id: 'remove',
					match: 'flag',
					flag: '--remove'
				},
				{
					id: 'message',
					type: 'string',
					match: 'rest',
					default: '[member] just left the server :('
				}
			],
			description: {
				content: 'Send a message to the current channel when a person leave, you can use [member] to show the member username and [server] to show the name of the server',
				usage: '[bye message]',
				examples: ['[member] left the server, he deserve a ban']
			}
		});
	}

	async exec(message, args) {
		const leave = await leaveChannel.findOne({where: {guildID: message.guild.id}});

		if (args.remove) {
			if (leave) {
				leave.destroy({where: {guildID: message.guild.id, channelID: message.channel.id}});
				return message.channel.send('successfully deleted the leave message');
			} else {
				return message.channel.send('Did not find the a leave message, are you sure you have one setup?');
			}
		}

		if (!args.message) {
			return message.channel.send('Please provide a message');
		}

		if (!leave) {
			const body = {guildID: message.guild.id, channelID: message.channel.id, message: args.message};
			await leaveChannel.create(body);
			return message.channel.send(`The leave message have been set with ${args.message}`);
		} else {
			message.channel.send('The server already have a leave message, do you want to replace it? y/n');
			const filter = m =>  m.content && m.author.id == message.author.id;
			message.channel.awaitMessages(filter, {time: 5000, max: 1, errors: ['time'] })
				.then(async messages => {
					let messageContent = messages.map(messages => messages.content);
					if (messageContent == 'y' || messageContent == 'yes') {
						const body = {guildID: message.guild.id, channelID: message.channel.id, message: args.message};
						await leave.update(body, {where: {guildID: message.guild.id}});
						return message.channel.send(`The leave message have been set with ${args.message}`);
					} else {
						return message.channel.send('Not updating.');
					}
				})
				.catch(err => {
					console.error(err);
					return message.channel.send('Took too long to answer. didin\'t update anything.');
				});
		}
	}
}

module.exports = byeCommand;