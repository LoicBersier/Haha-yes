const { Command } = require('discord-akairo');
const joinChannel = require('../../models').joinChannel;

class welcomeCommand extends Command {
	constructor() {
		super('welcome', {
			aliases: ['welcome', 'join'],
			category: 'admin',
			channel: 'guild',
			userPermissions: ['MANAGE_CHANNELS'],
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
					default: 'Welcome [member] to [server]!'
				}
			],
			description: {
				content: 'Send a message to the current channel when a person join, you can use [member] to show the member username and [server] to show the name of the server',
				usage: '[welcome message]',
				examples: ['everyone welcome [adjectives] [member] and welcome on [server]']
			}
		});
	}

	async exec(message, args) {
		const join = await joinChannel.findOne({where: {guildID: message.guild.id}});

		if (args.remove) {
			if (join) {
				join.destroy({where: {guildID: message.guild.id, channelID: message.channel.id}});
				return message.channel.send('successfully deleted the join message');
			} else {
				return message.channel.send('Did not find the a join message, are you sure you have one setup?');
			}
		}

		if (!args.message) {
			return message.channel.send('Please provide a message');
		}

		if (!join) {
			const body = {guildID: message.guild.id, channelID: message.channel.id, message: args.message};
			await joinChannel.create(body);
			return message.channel.send(`The join message have been set with ${args.message}`);
		} else {
			message.channel.send('The server already have a join message, do you want to replace it? y/n');
			const filter = m =>  m.content && m.author.id == message.author.id;
			message.channel.awaitMessages(filter, {time: 5000, max: 1, errors: ['time'] })
				.then(async messages => {
					let messageContent = messages.map(messages => messages.content);
					if (messageContent == 'y' || messageContent == 'yes') {
						const body = {guildID: message.guild.id, channelID: message.channel.id, message: args.message};
						await joinChannel.update(body, {where: {guildID: message.guild.id}});
						return message.channel.send(`The join message have been set with ${args.message}`);
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

module.exports = welcomeCommand;