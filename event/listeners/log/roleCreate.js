const { Listener } = require('discord-akairo');
const LogStats = require('../../../models/').LogStats;

class roleCreateListener extends Listener {
	constructor() {
		super('roleCreate', {
			emitter: 'client',
			event: 'roleCreate'
		});
	}

	async exec(role) {
		const guild = role.guild;
		const logStats = await LogStats.findOne({where: {guild: guild.id}});
		if (logStats) {
			const fetchedLogs = await guild.fetchAuditLogs({
				limit: 1,
				type: 'ROLE_CREATE',
			});

			const creationLog = fetchedLogs.entries.first();

			const channel = this.client.channels.resolve(await logStats.get('channel'));
			let Embed = this.client.util.embed()
				.setColor('NAVY')
				.setTitle('New role')
				.setDescription(`${role.name} got created!`)
				.setTimestamp();

			if (!creationLog) return channel.send(Embed);

			Embed.setDescription(`${role.name} got created by ${creationLog.executor}`);

			channel.send(Embed);
		}
	}
}
module.exports = roleCreateListener;
