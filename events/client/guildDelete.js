import db from '../../models/index.js';
const guildBlacklist = db.guildBlacklist;
import { MessageEmbed } from 'discord.js';

import dotenv from 'dotenv';
dotenv.config();
const { statusChannel, NODE_ENV } = process.env;

export default {
	name: 'guildDelete',
	once: true,
	async execute(guild, client) {
		const guildOwner = await client.users.fetch(guild.ownerId);

		console.log(`***BOT KICKED***\n${guild.name}\n${guild.memberCount} users\nOwner: ${guildOwner.username}\nOwner ID: ${guild.ownerId}\n***BOT KICKED***`);

		const blacklist = await guildBlacklist.findOne({ where: { guildID:guild.id } });

		// If stats channel settings exist, send bot stats to it
		if (statusChannel && NODE_ENV !== 'development') {
			const channel = client.channels.resolve(statusChannel);
			const botCount = guild.members.cache.filter(member => member.user.bot).size;
			console.log(guild.memberCount);
			const kickEmbed = new MessageEmbed()
				.setColor('#FF0000')
				.setTitle('Some mofo just removed me from there guild :(')
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
				kickEmbed.setFooter({ text: kickEmbed.footer.text + ' | Left this guild because owner is blacklisted!' });
			}

			channel.send({ embeds: [kickEmbed] });
		}
	},
};