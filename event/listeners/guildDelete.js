const { Listener } = require('discord-akairo');
const { statsChannel } = require('../../config.json');


class guildCreateListener extends Listener {
	constructor() {
		super('guildDelete', {
			emitter: 'client',
			event: 'guildDelete'
		});
	}

	async exec(guild) {
		console.log(`***BOT KICKED***\n${guild.name}\n${guild.memberCount} users\nOwner: ${guild.owner.user.username}\nOwner ID: ${guild.owner}\n***BOT KICKED***`);
		const channel = this.client.channels.get(statsChannel);

		const kickEmbed = this.client.util.embed()
			.setColor('#FF0000')
			.setTitle('Some mofo just removed me from there guild :(')
			.setURL('https://www.youtube.com/watch?v=6n3pFFPSlW4')
			.setThumbnail(guild.iconURL())
			.addField('Guild name', guild.name, true)
			.addField('Guild ID', guild.id, true)
			.addField('Total number of members', guild.memberCount, true)
			.addField('Number of users', guild.members.filter(member => !member.user.bot).size, true)
			.addField('Number of bots', guild.members.filter(member => member.user.bot).size, true)
			.addField('Owner', guild.owner.user.username, true)
			.addField('Owner ID', guild.owner.id, true)
			.setFooter(`I'm now in ${this.client.guilds.size} servers!`)
			.setTimestamp();

		channel.send({ embed: kickEmbed });
	}
}

module.exports = guildCreateListener;