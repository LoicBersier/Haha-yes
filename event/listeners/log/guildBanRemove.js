const { Listener } = require('discord-akairo');
const LogStats = require('../../../models/').LogStats;

class guildBanRemoveListener extends Listener {
	constructor() {
		super('guildBanRemove', {
			emitter: 'client',
			event: 'guildBanRemove'
		});
	}

	async exec(guild, user) {
		const logStats = await LogStats.findOne({where: {guild: guild.id}});
		if (logStats) {
			const fetchedLogs = await guild.fetchAuditLogs({
				limit: 1,
				type: 'MEMBER_BAN_REMOVE',
			});

			const unbanLog = fetchedLogs.entries.first();

			const channel = this.client.channels.resolve(await logStats.get('channel'));
			let Embed = this.client.util.embed()
				.setColor('NAVY')
				.setTitle('A user got unbanned!')
				.setDescription(`${user.tag} got unbanned!`)
				.setTimestamp();

			if (!unbanLog) return channel.send(Embed);

			Embed.setDescription(`${user.tag} got unbanned by ${unbanLog.executor}`);

			channel.send(Embed);
		}
	}
}
module.exports = guildBanRemoveListener;