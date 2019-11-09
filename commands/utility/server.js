const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class ServerCommand extends Command {
	constructor() {
		super('server', {
			aliases: ['server', 'serverinfo'],
			category: 'utility',
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
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
			.setColor(message.member.displayHexColor)
			.setTitle(message.guild.name)
			.setThumbnail(message.guild.iconURL())
			.addField('Number of users', message.guild.members.filter(member => !member.user.bot).size, true)
			.addField('Number of bots', message.guild.members.filter(member => member.user.bot).size, true)
			.addField('Total number of members', message.guild.memberCount, true)
			.addField('Number of channels', message.guild.channels.size, true)
			.addBlankField()
			.addField('Date when guild created', message.guild.createdAt, true)
			.addField('Owner', message.guild.owner, true)
			.setTimestamp();
        

		
		message.channel.send({ embed: addEmbed });
	}
}

module.exports = ServerCommand;