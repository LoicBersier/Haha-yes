const { Command } = require('discord-akairo');
const LogStats = require('../../models').LogStats;

class logCommand extends Command {
	constructor() {
		super('log', {
			aliases: ['log', 'logging'],
			category: 'admin',
			userPermissions: ['MANAGE_MESSAGES'],
			clientPermissions: ['MANAGE_GUILD'],
			channel: 'guild',
			description: {
				content: 'Setup logging in current channel (W.I.P)',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message, args) {
		const logStats = await LogStats.findOne({where: {guild: message.guild.id}});
		const ownerID = this.client.ownerID;

		if (!logStats) {
			const body = {guild: message.guild.id, channel: message.channel.id};
			await LogStats.create(body);
			return message.channel.send('Logging has been enabled on this channel');
		} else if (logStats.get('ownerID') == message.author.id || message.member.hasPermission('ADMINISTRATOR') || message.author.id == ownerID) {
			message.channel.send('The log channel is already setup, do you want to delete it? y/n');
			const filter = m =>  m.content && m.author.id == message.author.id;
			message.channel.awaitMessages(filter, {time: 5000, max: 1, errors: ['time'] })
				.then(async messages => {
					let messageContent = messages.map(messages => messages.content.toLowerCase());
					if (messageContent[0] === 'y' || messageContent[0] === 'yes') {
						await LogStats.destroy({where: {guild: message.guild.id}});
						return message.channel.send('Log channel has been disabled!');
					} else {
						return message.channel.send('Not updating.');
					}
				})
				.catch(err => {
					console.error(err);
					return message.channel.send('Took too long to answer. didin\'t change anything.');
				});
		} else {
			return message.channel.send(`You are not the owner of this tag, if you think it is problematic ask an admin to remove it by doing ${this.client.commandHandler.prefix[0]}tag ${args.trigger} --remove`);
		}
	}
}

module.exports = logCommand;