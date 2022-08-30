import db from '../../models/index.js';
const guildBlacklist = db.guildBlacklist;
import { EmbedBuilder } from 'discord.js';

const { statusChannel, NODE_ENV } = process.env;

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
		if (statusChannel && NODE_ENV !== 'development') {
			const channel = client.channels.resolve(statusChannel);
			const botCount = guild.members.cache.filter(member => member.user.bot).size;
			console.log(guild.memberCount);
			const addEmbed = new EmbedBuilder()
				.setColor('#52e80d')
				.setTitle('New boiz in town')
				.setURL('https://www.youtube.com/watch?v=6n3pFFPSlW4')
				.setThumbnail(guild.iconURL())
				.addFields(
					{ name: 'Guild', value: `${guild.name} (${guild.id})` },
					{ name: 'Total number of members', value: guild.memberCount.toString(), inline: true },
					{ name: 'Number of users', value: (guild.memberCount - botCount).toString(), inline: true },
					{ name: 'Number of bots', value: botCount.toString(), inline: true },
					{ name: 'Owner', value: `${guildOwner.username} (${guild.ownerId})`, inline: true },
				)
				.setFooter({ text: `I'm now in ${client.guilds.cache.size} servers!` })
				.setTimestamp();

			if (blacklist) {
				return channel.send(`${guildOwner.username} (${guild.ownerId}) tried to add me to their guild while being blacklisted!\n${guild.name} (${guild.id})`);
			}

			channel.send({ embeds: [addEmbed] });
		}
	},
};