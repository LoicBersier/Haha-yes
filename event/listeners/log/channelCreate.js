const { Listener } = require('discord-akairo');
const LogStats = require('../../../models/').LogStats;

class channelCreateListener extends Listener {
	constructor() {
		super('channelCreate', {
			emitter: 'client',
			event: 'channelCreate'
		});
	}

	async exec(GuildChannel) {
		const logStats = await LogStats.findOne({where: {guild: GuildChannel.guild.id}});
		if (logStats) {
			const channel = this.client.channels.resolve(await logStats.get('channel'));
			let Embed = this.client.util.embed()
				.setColor('NAVY')
				.setTitle('Channel created!')
				.setDescription(`${GuildChannel.type} channel ${GuildChannel} got created!`)
				.setFooter(`Channel ID: ${GuildChannel.id}`)
				.setTimestamp();

			channel.send(Embed);
		}
	}
}
module.exports = channelCreateListener;