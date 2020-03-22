const { Command } = require('discord-akairo');

class ServerCommand extends Command {
	constructor() {
		super('server', {
			aliases: ['server', 'serverinfo'],
			category: 'utility',
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
			channel: 'guild',
			description: {
				content: 'Show info about the server',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message) {
		let botCount = message.guild.members.cache.filter(member => member.user.bot).size;
		const addEmbed = this.client.util.embed()
			.setColor(message.member ? message.member.displayHexColor : 'NAVY')
			.setTitle(message.guild.name)
			.setThumbnail(message.guild.iconURL())
			.addField('Number of users', message.guild.memberCount - botCount, true)
			.addField('Number of bots', botCount, true)
			.addField('Total number of members', message.guild.memberCount, true)
			.addField('Number of channels', message.guild.channels.cache.size, true) 
			.addField('​', '​')
			.addField('Date when guild created', message.guild.createdAt, true)
			.addField('Owner', message.guild.owner, true)
			.setTimestamp();
        

		
		message.channel.send({ embed: addEmbed });
	}
}

module.exports = ServerCommand;