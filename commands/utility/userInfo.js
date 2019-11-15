const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class userInfoCommand extends Command {
	constructor() {
		super('userInfo', {
			aliases: ['userInfo', 'user'],
			category: 'utility',
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
			channelRestriction: 'guild',
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

		const Embed = new MessageEmbed()
			.setColor(member.displayHexColor)
			.setAuthor(`${user.tag} (${user.id})`, user.displayAvatarURL())
			.addField('Current rank hex color', member.displayHexColor, true)
			.addField('Joined guild at', member.joinedAt, true)
			.addField('Date when account created', user.createdAt, true)
			.setTimestamp();


		// Show since when this user have been boosting the current guild
		if (member.premiumSince) Embed.addField('Boosting this guild since', member.premiumSince, true);

		Embed.addBlankField();
		
		// Show user status
		if (user.presence.activity) Embed.addField('Presence', user.presence.activity, true);

		// Is the user a bot?
		if (user.bot) Embed.addField('Is a bot?', '✅', true); else if (!user.bot) Embed.addField('Is a bot?', '❌', true);
		
		// Show guild nickname
		if (member.nickname) Embed.addField('Nickname', member.nickname, true);
		// Show user locale ( i have no idea what it is ) https://discord.js.org/#/docs/main/master/class/User?scrollTo=locale
		if (user.locale) Embed.addField('Locale settings', user.locale, true);

		// Show on which platform they are using discord from if its not a bot
		if (user.presence.clientStatus && !user.bot) {
			Embed.addBlankField();
			if (user.presence.clientStatus.mobile) Embed.addField('Using discord on', '📱 ' + user.presence.clientStatus.mobile, true);
			if (user.presence.clientStatus.desktop) Embed.addField('Using discord on', '💻 ' + user.presence.clientStatus.desktop, true);
			if (user.presence.clientStatus.web) Embed.addField('Using discord on', '☁️ ' + user.presence.clientStatus.web, true);
		}
		
		return message.channel.send({ embed: Embed });
	}
}

module.exports = userInfoCommand;