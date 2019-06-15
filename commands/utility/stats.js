const { Command } = require('discord-akairo');
const akairoVersion = require('discord-akairo').version;
const { MessageEmbed, version } = require('discord.js');

class StatsCommand extends Command {
	constructor() {
		super('stats', {
			aliases: ['stats'],
			category: 'utility',
			description: {
				content: 'Show some stats about the bot',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message) {
		let totalSeconds = (this.client.uptime / 1000);
		let days = Math.floor(totalSeconds / 86400);
		let hours = Math.floor(totalSeconds / 3600);
		totalSeconds %= 3600;
		let minutes = Math.floor(totalSeconds / 60);
		let seconds = totalSeconds.toFixed(0) % 60;
		let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
		const used = process.memoryUsage().heapUsed / 1024 / 1024;

		const statsEmbed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Bot stats')
			.setAuthor('Haha yes')
			.addField('Servers', this.client.guilds.size, true)
			.addField('Channels', this.client.channels.size, true)
			.addField('Users', this.client.users.size, true)
			.addField('Uptime', uptime, true)
			.addField('Ram usage', `${Math.round(used * 100) / 100} MB`, true)
			.addField('Nodejs version', process.version, true)
			.addField('Discord.js version', version, true)
			.addField('Discord-Akairo version', akairoVersion, true)
			.setTimestamp();
			
		return message.channel.send(statsEmbed);
	}
}

module.exports = StatsCommand;