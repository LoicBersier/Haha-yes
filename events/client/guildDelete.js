import db from '../../models/index.js';
const guildBlacklist = db.guildBlacklist;
import { EmbedBuilder } from 'discord.js';

const { statusChannel, NODE_ENV } = process.env;

export default {
	name: 'guildDelete',
	async execute(guild, client) {
		const guildOwner = await client.users.fetch(guild.ownerId);

		const isOptOut = await db.optout.findOne({ where: { userID: guildOwner.id } });

		if (isOptOut) {
			console.log(`***BOT KICKED***A guild\n${guild.memberCount} users\n***BOT KICKED***`);
			if (statusChannel && NODE_ENV !== 'development') {
				const channel = client.channels.resolve(statusChannel);

				channel.send({ content: `An anonymous guild just removed me.\nI'm now in ${client.guilds.cache.size} servers!` });
			}
			return;
		}

		console.log(`***BOT KICKED***\n${guild.name}\n${guild.memberCount} users\nOwner: ${guildOwner.username}\nOwner ID: ${guild.ownerId}\n***BOT KICKED***`);

		const blacklist = await guildBlacklist.findOne({ where: { guildID:guild.id } });

		// If stats channel settings exist, send bot stats to it
		if (statusChannel && NODE_ENV !== 'development') {
			const channel = client.channels.resolve(statusChannel);
			const botCount = guild.members.cache.filter(member => member.user.bot).size;
			console.log(guild.memberCount);
			const kickEmbed = new EmbedBuilder()
				.setColor('#FF0000')
				.setTitle('Some mofo just removed me from there guild :(')
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
				kickEmbed.setFooter({ text: kickEmbed.footer.text + ' | Left this guild because owner is blacklisted!' });
			}

			channel.send({ embeds: [kickEmbed] });
		}
	},
};