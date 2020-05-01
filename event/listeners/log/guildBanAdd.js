const { Listener } = require('discord-akairo');
const LogStats = require('../../../models/').LogStats;

class guildBanAddListener extends Listener {
	constructor() {
		super('guildBanAdd', {
			emitter: 'client',
			event: 'guildBanAdd'
		});
	}

	async exec(guild, user) {
		const logStats = await LogStats.findOne({where: {guild: guild.id}});
		if (logStats) {
			const fetchedLogs = await guild.fetchAuditLogs({
				limit: 1,
				type: 'MEMBER_BAN_ADD',
			});

			const banLog = fetchedLogs.entries.first();

			const channel = this.client.channels.resolve(await logStats.get('channel'));
			let Embed = this.client.util.embed()
				.setColor('NAVY')
				.setTitle('A user got banned!')
				.setDescription(`${user.tag} got banned!`)
				.setTimestamp();

			if (!banLog) return channel.send(Embed);

			Embed.setDescription(`${user.tag} got banned by ${banLog.executor}`);

			channel.send(Embed);
		}
	}
}
module.exports = guildBanAddListener;