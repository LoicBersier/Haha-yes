import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed, version } from 'discord.js';
import os from 'node:os';

export default {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Show some stats about the bot'),
	async execute(interaction) {
		const client = interaction.client;
		const uptime = process.uptime();
		const date = new Date(uptime * 1000);
		const days = date.getUTCDate() - 1,
			hours = date.getUTCHours(),
			minutes = date.getUTCMinutes(),
			seconds = date.getUTCSeconds();


		const segments = [];

		// Format the uptime string.
		if (days > 0) segments.push(days + ' day' + ((days == 1) ? '' : 's'));
		if (hours > 0) segments.push(hours + ' hour' + ((hours == 1) ? '' : 's'));
		if (minutes > 0) segments.push(minutes + ' minute' + ((minutes == 1) ? '' : 's'));
		if (seconds > 0) segments.push(seconds + ' second' + ((seconds == 1) ? '' : 's'));
		const dateString = segments.join(', ');

		const bytesToSize = (bytes) => {
			const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
			if (bytes == 0) return '0 Byte';
			const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
			return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
		};

		const statsEmbed = new MessageEmbed()
			.setColor(interaction.member ? interaction.member.displayHexColor : 'NAVY')
			.setTitle('Bot stats')
			.setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: 'https://libtar.de' })
			.addField('Servers', client.guilds.cache.size.toString(), true)
			.addField('Channels', client.channels.cache.size.toString(), true)
			.addField('Users', client.users.cache.size.toString(), true)
			.addField('Ram usage', `${bytesToSize(process.memoryUsage().heapUsed)}/${bytesToSize(os.totalmem)}`, true)
			.addField('CPU', `${os.cpus()[0].model} (${os.cpus().length} core)`, true)
			.addField('OS', `${os.platform()} ${os.release()}`, true)
			.addField('Nodejs version', process.version, true)
			.addField('Discord.js version', version, true)
			.addField('Uptime', dateString, true)
			.setTimestamp();

		return interaction.reply({ embeds: [statsEmbed] });
	},
};
