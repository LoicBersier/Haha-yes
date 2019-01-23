const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const reload = require('auto-reload');

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
		const autoresponse = reload('../../json/autoresponse.json');
		let autoresponseStatus;
		if (autoresponse[message.channel.id] == undefined || autoresponse[message.channel.id] == 'disable')
			autoresponseStatus = 'disabled';
		else if (autoresponse[message.channel.id] == 'enable')
			autoresponseStatus = 'enabled';

		const customresponse = require(`../../tag/${message.guild.id}.json`);
		var count = Object.keys(customresponse).length;

		const addEmbed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Stats of the server')
			.setAuthor(message.author.username)
			.addField('Member', message.guild.memberCount, true)
			.addField('Numbers of channel', message.guild.channels.size, true)
			.addField('Date when guild created', message.guild.createdAt, true)
			.addField('Owner', message.guild.owner, true)
			.addField('Numbers of tag', count, true)
			.addField('Autoresponse in this channel', autoresponseStatus, true)
			.setTimestamp();
        

		
		message.channel.send({ embed: addEmbed });
	}
}

module.exports = ServerCommand;