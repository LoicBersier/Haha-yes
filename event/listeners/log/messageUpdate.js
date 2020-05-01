const { Listener } = require('discord-akairo');
const LogStats = require('../../../models/').LogStats;

class messageUpdateListener extends Listener {
	constructor() {
		super('messageUpdate', {
			emitter: 'client',
			event: 'messageUpdate'
		});
	}

	async exec(oldMessage, newMessage) {
		const logStats = await LogStats.findOne({where: {guild: newMessage.guild.id}});
		if (logStats) {
			const channel = this.client.channels.resolve(await logStats.get('channel'));
			let Embed = this.client.util.embed()
				.setColor('NAVY')
				.setAuthor(`${newMessage.author.username}#${newMessage.author.discriminator}`, newMessage.author.displayAvatarURL())
				.setTitle(`${newMessage.author.username} modified their message in ${newMessage.channel.name}`)
				.addField('Previously', oldMessage, true)
				.addField('Currently', newMessage, true)
				.setFooter(`Author ID: ${newMessage.author.id}, Message ID: ${newMessage.id}`)
				.setTimestamp();

			channel.send(Embed);
		}
	}
}
module.exports = messageUpdateListener;