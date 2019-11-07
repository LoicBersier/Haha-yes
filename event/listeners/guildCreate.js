const { Listener } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { statsChannel } = require('../../config.json');


class guildCreateListener extends Listener {
	constructor() {
		super('guildCreate', {
			emitter: 'client',
			event: 'guildCreate'
		});
	}

	async exec(guild) {
		console.log(`${guild.name}\n${guild.memberCount} users\nOwner: ${guild.owner.user.username}\nOwner ID: ${guild.owner}`);
		const channel = this.client.channels.get(statsChannel);
		const addEmbed = new MessageEmbed()
			.setColor('#52e80d')
			.setTitle('New boiz in town')
			.setURL('https://www.youtube.com/watch?v=6n3pFFPSlW4')
			.setThumbnail(guild.iconURL())
			.addField('Guild name', guild.name, true)
			.addField('Guild ID', guild.id, true)
			.addField('Total number of members', guild.memberCount, true)
			.addField('Number of users', guild.members.filter(member => !member.user.bot).size, true)
			.addField('Number of bots', guild.members.filter(member => member.user.bot).size, true)
			.addField('Owner', guild.owner.user.username, true)
			.addField('Owner ID', guild.owner.id, true)
			.setFooter(`Im now in ${this.client.guilds.size} servers!`)
			.setTimestamp();
	
		channel.send({ embed: addEmbed });
	}
}
module.exports = guildCreateListener;