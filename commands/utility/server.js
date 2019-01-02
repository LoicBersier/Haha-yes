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
		const customresponse = require(`../../tag/${message.guild.id}.json`);
		var count = Object.keys(customresponse).length;

		const addEmbed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Stats of the server')
			.setAuthor(message.author.username)
			.setDescription(`Member: **${message.guild.memberCount}** \nChannel number: **${message.guild.channels.size}**\nGuild created at **${message.guild.createdAt}**\nOwner: **${message.guild.owner}**\nTag number: **${count}**`)
			.setTimestamp();
        

		
		message.channel.send({ embed: addEmbed });
	}
}

module.exports = ServerCommand;