const { Command } = require('discord-akairo');

class userInfoCommand extends Command {
	constructor() {
		super('userInfo', {
			aliases: ['userInfo', 'user'],
			category: 'utility',
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
			channel: 'guild',
			args: [
				{
					id: 'user',
					type: 'user',
				},
			],
			description: {
				content: 'Show info about a user',
				usage: '[@user]',
				examples: ['@SomeoneReallyCoolInMyGuild']
			}
		});
	}

	async exec(message, args) {
		let user = message.author;

		if (args.user) {
			user = args.user;
		}

		let member = message.guild.member(user);
		const Embed = this.client.util.embed()
			.setColor(member ? member.displayHexColor : 'NAVY')
			.setAuthor(`${user.tag} (${user.id})`, user.displayAvatarURL())
			.addField('Current rank hex color', member ? member.displayHexColor : 'No rank color', true)
			.addField('Joined guild at', member ? member.joinedAt : 'Not in this guild', true)
			.addField('Date when account created', user.createdAt, true)
			.setTimestamp();


		Embed.addField('​', '​');

		// Show user status
		if (user.presence.activities[0]) {
			Embed.addField('Presence', user.presence.activities[0], true);
			if (user.presence.activities[0].details) Embed.addField('​', user.presence.activities[0].details, true);
			if (user.presence.activities[0].state) Embed.addField('​', user.presence.activities[0].state, true);
		}
		// Is the user a bot?
		if (user.bot) Embed.addField('Is a bot?', '✅', true);

		// Show user locale ( i have no idea what it is ) https://discord.js.org/#/docs/main/master/class/User?scrollTo=locale
		if (user.locale) Embed.addField('Locale settings', user.locale, true);

		// Show on which platform they are using discord from if its not a bot
		if (user.presence.clientStatus && !user.bot) {
			Embed.addField('​', '​');
			if (user.presence.clientStatus.mobile) Embed.addField('Using discord on', '📱 ' + user.presence.clientStatus.mobile, true);
			if (user.presence.clientStatus.desktop) Embed.addField('Using discord on', '💻 ' + user.presence.clientStatus.desktop, true);
			if (user.presence.clientStatus.web) Embed.addField('Using discord on', '☁️ ' + user.presence.clientStatus.web, true);
		}

		if (member) {
			// Show since when this user have been boosting the current guild
			if (member.premiumSince) Embed.addField('Boosting this guild since', member.premiumSince, true);
			// Show guild nickname
			if (member.nickname) Embed.addField('Nickname', member.nickname, true);
			// Show member roles
			if (member.roles) Embed.addField('Roles', `${member.roles.cache.array().join(', ')}`);
		}

		return message.channel.send({ embed: Embed });
	}
}

module.exports = userInfoCommand;
