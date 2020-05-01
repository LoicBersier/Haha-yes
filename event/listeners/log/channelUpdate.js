const { Listener } = require('discord-akairo');
const LogStats = require('../../../models/').LogStats;

class channelUpdateListener extends Listener {
	constructor() {
		super('channelUpdate', {
			emitter: 'client',
			event: 'channelUpdate'
		});
	}

	async exec(oldChannel, newChannel) {
		const logStats = await LogStats.findOne({where: {guild: newChannel.guild.id}});

		if (logStats) {
			const channel = this.client.channels.resolve(await logStats.get('channel'));
			let Embed = this.client.util.embed()
				.setColor('NAVY')
				.setTitle(`${newChannel.type} channel updated!`)
				.setTimestamp();

			if (oldChannel.name !== newChannel.name) {
				Embed.addField('Previous channel', oldChannel.name, true)
					.addField('New channel', newChannel.name, true);
			}

			if (oldChannel.topic !== newChannel.topic) {
				Embed.addField('Previous channel topic', oldChannel.topic, true)
					.addField('New channel topic', newChannel.topic, true);
			}

			if (oldChannel.nsfw !== newChannel.nsfw) {
				Embed.addField('Previous channel nsfw', oldChannel.nsfw, true)
					.addField('New channel nsfw', newChannel.nsfw, true);
			}

			if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
				Embed.addField('Previous channel slowmode', `${oldChannel.rateLimitPerUser} seconds`, true)
					.addField('New channel slowmode', `${newChannel.rateLimitPerUser} seconds`, true);
			}

			channel.send(Embed);
		}
	}
}
module.exports = channelUpdateListener;