const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class ServerCommand extends Command {
	constructor() {
		super('server', {
			aliases: ['server', 'serverinfo'],
			category: 'utility',
			channelRestriction: 'guild',
			description: {
				content: 'Show info about the server',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message) {
		const addEmbed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle(message.guild.name)
			.setThumbnail(message.guild.iconURL())
			.addField('Numbers of users', message.guild.members.filter(member => !member.user.bot).size, true)
			.addField('Numbers of bots', message.guild.members.filter(member => member.user.bot).size, true)
			.addField('Total numbers of members', message.guild.memberCount, true)
			.addField('Numbers of channel', message.guild.channels.size, true)
			.addBlankField()
			.addField('Date when guild created', message.guild.createdAt, true)
			.addField('Owner', message.guild.owner, true)
			.setTimestamp();
        

		
		message.channel.send({ embed: addEmbed });
	}
}

module.exports = ServerCommand;