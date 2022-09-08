import { SlashCommandBuilder } from 'discord.js';
import { EmbedBuilder, version } from 'discord.js';
import os from 'node:os';

export default {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Show some stats about the bot'),
	category: 'utility',
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

		const statsEmbed = new EmbedBuilder()
			.setColor(interaction.member ? interaction.member.displayHexColor : 'Navy')
			.setTitle('Bot stats')
			.setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: 'https://libtar.de' })
			.addFields(
				{ name: 'Servers', value: client.guilds.cache.size.toString(), inline: true },
				{ name: 'Channels', value: client.channels.cache.size.toString(), inline: true },
				{ name: 'Users', value: client.users.cache.size.toString(), inline: true },
				{ name: 'Ram usage', value: `${bytesToSize(process.memoryUsage().heapUsed)}/${bytesToSize(os.totalmem)}`, inline: true },
				{ name: 'CPU', value: `${os.cpus()[0].model} (${os.cpus().length} core)`, inline: true },
				{ name: 'OS', value: `${os.platform()} ${os.release()}`, inline: true },
				{ name: 'Nodejs version', value: process.version, inline: true },
				{ name: 'Discord.js version', value: version, inline: true },
				{ name: 'Uptime', value: dateString, inline: true },
			)
			.setTimestamp();

		return interaction.reply({ embeds: [statsEmbed] });
	},
};
