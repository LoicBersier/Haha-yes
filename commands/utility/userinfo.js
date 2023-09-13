import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
	data: new SlashCommandBuilder()
		.setName('userinfo')
		.setDescription('Show info about a user')
		.addMentionableOption(option =>
			option.setName('user')
				.setDescription('Which user you want to see the info of?')
				.setRequired(false)),
	category: 'utility',
	alias: ['user'],
	async execute(interaction, args, client) {
		await interaction.guild.members.fetch();
		let member = interaction.member;
		let user = interaction.user;
		if (args.user) {
			user = client.users.resolve(args.user);
			member = interaction.guild.members.resolve(args.user);
		}
		const Embed = new EmbedBuilder()
			.setColor(member ? member.displayHexColor : 'Navy')
			.setAuthor({ name: `${user.username} (${user.id})`, iconURL:  user.displayAvatarURL() })
			.addFields(
				{ name: 'Current rank hex color', value: member ? member.displayHexColor : 'No rank color', inline: true },
				{ name: 'Joined guild at', value: member ? member.joinedAt.toString() : 'Not in this guild', inline: true },
				{ name: 'Date when account created', value: user.createdAt.toString(), inline: true },
			)
			.setTimestamp();


		Embed.addFields({ name: '​', value: '​' });

		// Show user status
		/* Missing presence intent.
		if (user.presence.activities[0]) {
			Embed.addField('Presence', user.presence.activities[0], true);
			if (user.presence.activities[0].details) Embed.addField('​', user.presence.activities[0].details, true);
			if (user.presence.activities[0].state) Embed.addField('​', user.presence.activities[0].state, true);
		}
        */
		// Is the user a bot?
		if (user.bot) Embed.addFields({ name: 'Is a bot?', value: '✅', inline: true });

		// Show on which platform they are using discord from if its not a bot
		/* Missing presence intent.
		if (user.presence.clientStatus && !user.bot) {
			Embed.addFields({ name: '​', value: '​' });
			if (user.presence.clientStatus.mobile) Embed.addFields({ name: 'Using discord on', value: '📱 ' + user.presence.clientStatus.mobile, inline: true });
			if (user.presence.clientStatus.desktop) Embed.addFields({ name: 'Using discord on', value: '💻 ' + user.presence.clientStatus.desktop, inline: true });
			if (user.presence.clientStatus.web) Embed.addFields({ name: 'Using discord on', value: '☁️ ' + user.presence.clientStatus.web, inline: true });
		}
        */

		if (member) {
			// Show since when this user have been boosting the current guild
			if (member.premiumSince) Embed.addFields({ name: 'Boosting this guild since', value: member.premiumSince.toString(), inline: true });
			// Show guild nickname
			if (member.nickname) Embed.addFields({ name: 'Nickname', value: member.nickname, inline: true });
			// Show member roles
			if (member.roles) {
				Embed.addFields({ name: 'Roles', value: `${[...member.roles.cache.values()].join(', ')}` });
				Embed.addFields({ name: 'Permissions', value: `\`${member.permissions.toArray().join(', ')}\`` });
			}
		}

		return interaction.reply({ embeds: [Embed] });
	},
};
