const { Listener } = require('discord-akairo');
const LogStats = require('../../../models/').LogStats;

class messageDeleteListener extends Listener {
	constructor() {
		super('messageDelete', {
			emitter: 'client',
			event: 'messageDelete'
		});
	}

	async exec(message) {
		const logStats = await LogStats.findOne({where: {guild: message.guild.id}});
		if (logStats) {
			const channel = this.client.channels.resolve(await logStats.get('channel'));
			let Embed = this.client.util.embed()
				.setColor('NAVY')
				.setAuthor(`${message.author.username}#${message.author.discriminator}`)
				.setDescription(`**${message.author} deleted their message in ${message.channel}**`)
				.addField('Message deleted', message)
				.setFooter(`Author ID: ${message.author.id}`)
				.setTimestamp();

			channel.send(Embed);
		}
	}
}
module.exports = messageDeleteListener;