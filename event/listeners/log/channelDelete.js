const { Listener } = require('discord-akairo');
const LogStats = require('../../../models/').LogStats;

class channelDeleteListener extends Listener {
	constructor() {
		super('channelDelete', {
			emitter: 'client',
			event: 'channelDelete'
		});
	}

	async exec(GuildChannel) {
		const logStats = await LogStats.findOne({where: {guild: GuildChannel.guild.id}});
		if (logStats) {
			const fetchedLogs = await GuildChannel.guild.fetchAuditLogs({
				limit: 1,
				type: 'CHANNEL_DELETE',
			});

			const deletionLog = fetchedLogs.entries.first();

			const channel = this.client.channels.resolve(await logStats.get('channel'));
			let Embed = this.client.util.embed()
				.setColor('NAVY')
				.setTitle('Channel created!')
				.setDescription(`${GuildChannel.type} channel ${GuildChannel} got deleted!`)
				.setTimestamp();

			if (!deletionLog) return  channel.send(Embed);

			Embed.setDescription(`${GuildChannel.type} channel ${GuildChannel} got deleted by ${deletionLog.executor}`);

			channel.send(Embed);
		}
	}
}
module.exports = channelDeleteListener;