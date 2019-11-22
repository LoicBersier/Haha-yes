const { Command } = require('discord-akairo');
const akairoVersion = require('discord-akairo').version;
const { version } = require('discord.js');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

class StatsCommand extends Command {
	constructor() {
		super('stats', {
			aliases: ['stats'],
			category: 'utility',
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
			description: {
				content: 'Show some stats about the bot',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message) {
		var uptime = process.uptime();
		const date = new Date(uptime*1000);
		const days = date.getUTCDate() - 1,
			hours = date.getUTCHours(),
			minutes = date.getUTCMinutes(),
			seconds = date.getUTCSeconds();
	
			
		let segments = [];
	
		// Format the uptime string. 	
		if (days > 0) segments.push(days + ' day' + ((days == 1) ? '' : 's'));
		if (hours > 0) segments.push(hours + ' hour' + ((hours == 1) ? '' : 's'));
		if (minutes > 0) segments.push(minutes + ' minute' + ((minutes == 1) ? '' : 's'));
		if (seconds > 0) segments.push(seconds + ' second' + ((seconds == 1) ? '' : 's'));
		const dateString = segments.join(', ');

		const used = process.memoryUsage().heapUsed / 1024 / 1024;

		// Get cpu model
		let cpu;
		if (process.platform == 'darwin') {
			const { stdout } = await exec('sysctl -n machdep.cpu.brand_string');
			cpu = stdout;
		} else if (process.platform == 'linux') {
			const { stdout } = await exec('lscpu | grep "Model name:" | sed -r \'s/Model name:\\s{1,}//g\'');
			cpu = stdout;
		} else if (process.platform == 'win32') {
			const { stdout } = await exec('wmic CPU get NAME');
			cpu = stdout.replace('Name', '');
		}

		const statsEmbed = this.client.util.embed()
			.setColor(message.member.displayHexColor)
			.setTitle('Bot stats')
			.setAuthor('Haha yes')
			.addField('Servers', this.client.guilds.size, true)
			.addField('Channels', this.client.channels.size, true)
			.addField('Users', this.client.users.size, true)
			.addField('Uptime', dateString, true)
			.addField('Ram usage', `${Math.round(used * 100) / 100} MB`, true)
			.addField('CPU', cpu, true)
			.addField('OS', process.platform, true)
			.addField('Nodejs version', process.version, true)
			.addField('Discord.js version', version, true)
			.addField('Discord-Akairo version', akairoVersion, true)
			.setTimestamp();
			
		return message.channel.send(statsEmbed);
	}
}

module.exports = StatsCommand;