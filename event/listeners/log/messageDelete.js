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
		if (message.partial) {
			await message.fetch()
				.catch(err => {
					return console.error(err);
				});
		}

		if (!message.guild) return;

		const logStats = await LogStats.findOne({where: {guild: message.guild.id}});
		if (logStats && !message.author.bot) {
			const fetchedLogs = await message.guild.fetchAuditLogs({
				limit: 1,
				type: 'MESSAGE_DELETE',
			});

			const deletionLog = fetchedLogs.entries.first();

			const channel = this.client.channels.resolve(await logStats.get('channel'));
			let Embed = this.client.util.embed()
				.setColor('NAVY')
				.setAuthor(`${message.author.username}#${message.author.discriminator}`)
				.setDescription(`**${message.author} message got deleted in ${message.channel}**`)
				.addField('Message deleted', message)
				.setFooter(`Author ID: ${message.author.id}`)
				.setTimestamp();

			if (!deletionLog) return channel.send(Embed);
			else if (deletionLog.target === message.author) {
				Embed.setDescription(`**${message.author} message was deleted by ${deletionLog.executor} in ${message.channel}**`);
			}

			channel.send(Embed);
		}
	}
}
module.exports = messageDeleteListener;