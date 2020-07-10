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
		if (oldMessage.partial) {
			await oldMessage.fetch()
				.catch(err => {
					return console.error(err);
				});
		}

		const logStats = await LogStats.findOne({where: {guild: newMessage.guild.id}});
		if (logStats && oldMessage.content !== newMessage.content && !oldMessage.author.bot) {
			const channel = this.client.channels.resolve(await logStats.get('channel'));
			let Embed = this.client.util.embed()
				.setColor('NAVY')
				.setAuthor(`${newMessage.author.username}#${newMessage.author.discriminator}`, newMessage.author.displayAvatarURL())
				.setDescription(`**${newMessage.author} modified their message in ${newMessage.channel}**`)
				.addField('Previously', oldMessage, true)
				.addField('Currently', newMessage, true)
				.setFooter(`Author ID: ${newMessage.author.id}, Message ID: ${newMessage.id}`)
				.setTimestamp();

			channel.send(Embed);
		}
	}
}
module.exports = messageUpdateListener;
