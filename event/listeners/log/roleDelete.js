const { Listener } = require('discord-akairo');
const LogStats = require('../../../models/').LogStats;

class roleDeleteListener extends Listener {
	constructor() {
		super('roleDelete', {
			emitter: 'client',
			event: 'roleDelete'
		});
	}

	async exec(role) {
		const guild = role.guild;
		const logStats = await LogStats.findOne({where: {guild: guild.id}});
		if (logStats) {
			const fetchedLogs = await guild.fetchAuditLogs({
				limit: 1,
				type: 'ROLE_DELETE',
			});

			const creationLog = fetchedLogs.entries.first();

			const channel = this.client.channels.resolve(await logStats.get('channel'));
			let Embed = this.client.util.embed()
				.setColor('NAVY')
				.setTitle('Role deleted')
				.setDescription(`${role.name} got deleted!`)
				.setTimestamp();

			if (!creationLog) return channel.send(Embed);

			Embed.setDescription(`${role.name} got deleted by ${creationLog.executor}`);

			channel.send(Embed);
		}
	}
}
module.exports = roleDeleteListener;
