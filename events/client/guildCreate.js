import db from '../../models/index.js';
const guildBlacklist = db.guildBlacklist;
import { MessageEmbed } from 'discord.js';

import dotenv from 'dotenv';
dotenv.config();
const { statusChannel } = process.env;

export default {
	name: 'guildCreate',
	once: true,
	async execute(guild, client) {
		const guildOwner = await client.users.fetch(guild.ownerId);

		console.log(`${guild.name}\n${guild.memberCount} users\nOwner: ${guildOwner.username}\nOwner ID: ${guild.ownerId}`);

		const blacklist = await guildBlacklist.findOne({ where: { guildID:guild.id } });

		if (blacklist) {
			guild.leave();
		}

		// If stats channel settings exist, send bot stats to it
		if (statusChannel) {
			const channel = client.channels.resolve(statusChannel);
			const botCount = guild.members.cache.filter(member => member.user.bot).size;
			console.log(guild.memberCount);
			const addEmbed = new MessageEmbed()
				.setColor('#52e80d')
				.setTitle('New boiz in town')
				.setURL('https://www.youtube.com/watch?v=6n3pFFPSlW4')
				.setThumbnail(guild.iconURL())
				.addField('Guild', `${guild.name} (${guild.id})`)
				.addField('Total number of members', guild.memberCount.toString(), true)
				.addField('Number of users', (guild.memberCount - botCount).toString(), true)
				.addField('Number of bots', botCount.toString(), true)
				.addField('Owner', `${guildOwner.username} (${guild.ownerId})`, true)
				.setFooter({ text: `I'm now in ${client.guilds.cache.size} servers!` })
				.setTimestamp();

			if (blacklist) {
				return channel.send(`${guildOwner.username} (${guild.ownerId}) tried to add me to their guild while being blacklisted!\n${guild.name} (${guild.id})`);
			}

			channel.send({ embeds: [addEmbed] });
		}
	},
};