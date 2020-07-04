const { Listener } = require('discord-akairo');
const { statsChannel } = require('../../config.json');
const guildBlacklist = require('../../models').guildBlacklist;

class guildCreateListener extends Listener {
	constructor() {
		super('guildDelete', {
			emitter: 'client',
			event: 'guildDelete'
		});
	}

	async exec(guild) {
		console.log(`***BOT KICKED***\n${guild.name}\n${guild.memberCount} users\nOwner: ${guild.owner.user.username}\nOwner ID: ${guild.owner}\n***BOT KICKED***`);
		const channel = this.client.channels.resolve(statsChannel);

		let botCount = guild.members.cache.filter(member => member.user.bot).size;

		const kickEmbed = this.client.util.embed()
			.setColor('#FF0000')
			.setTitle('Some mofo just removed me from there guild :(')
			.setURL('https://www.youtube.com/watch?v=6n3pFFPSlW4')
			.setThumbnail(guild.iconURL())
			.addField('Guild', `${guild.name} (${guild.id})`)
			.addField('Total number of members', guild.memberCount, true)
			.addField('Number of users', guild.memberCount - botCount, true)
			.addField('Number of bots', botCount, true)
			.addField('Owner', `${guild.owner.user.username} (${guild.owner.id})`, true)
			.setFooter(`I'm now in ${this.client.guilds.cache.size} servers!`)
			.setTimestamp();

		const blacklist = await guildBlacklist.findOne({where: {guildID:guild.id}});

		if (blacklist) {
			guild.leave();
			kickEmbed.setFooter(kickEmbed.footer.text + ' | Left this guild because owner is blacklisted!');
		}

		channel.send({ embed: kickEmbed });
	}
}

module.exports = guildCreateListener;