const { Command } = require('discord-akairo');

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
		return message.channel.send(`Servers: \`${this.client.guilds.size}\`\nChannels: \`${this.client.channels.size}\`\nUsers: \`${this.client.users.size}\`\nBot uptime: \`${uptime}\``);
	}
}

module.exports = StatsCommand;