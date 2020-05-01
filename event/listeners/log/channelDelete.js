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
			const channel = this.client.channels.resolve(await logStats.get('channel'));
			let Embed = this.client.util.embed()
				.setColor('NAVY')
				.setTitle('Channel created!')
				.setDescription(`${GuildChannel.type} channel ${GuildChannel.name} got deleted!`)
				.setTimestamp();

			channel.send(Embed);
		}
	}
}
module.exports = channelDeleteListener;