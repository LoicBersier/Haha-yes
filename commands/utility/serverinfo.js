import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
	data: new SlashCommandBuilder()
		.setName('serverinfo')
		.setDescription('Show info about the server'),
	category: 'utility',
	alias: ['server'],
	async execute(interaction, args, client) {
		await interaction.guild.members.fetch();
		const botCount = interaction.guild.members.cache.filter(member => member.user.bot).size;
		const guildOwner = await client.users.fetch(interaction.guild.ownerId);

		const addEmbed = new EmbedBuilder()
			.setColor(interaction.member ? interaction.member.displayHexColor : 'NAVY')
			.setTitle(interaction.guild.name)
			.setThumbnail(interaction.guild.iconURL())
			.addFields(
				{ name: 'Number of users', value: (interaction.guild.memberCount - botCount).toString(), inline: true },
				{ name: 'Number of bots', value: botCount.toString(), inline: true },
				{ name: 'Total number of members', value: interaction.guild.memberCount.toString(), inline: true },
				{ name: 'Number of channels', value: interaction.guild.channels.cache.size.toString(), inline: true },
				{ name: '​', value:'​' },
				{ name: 'Date when guild created', value: interaction.guild.createdAt.toString(), inline: true },
				{ name: 'Owner', value: guildOwner.toString(), inline: true },
			)
			.setTimestamp();


		interaction.reply({ embeds: [addEmbed] });

	},
};
