const { Command } = require('discord-akairo');

class BanCommand extends Command {
	constructor() {
		super('ban', {
			aliases: ['ban'],
			category: 'admin',
			args: [
				{
					id: 'member',
					type: 'member'
				},
				{
					id: 'reasons',
					type: 'string',
					match: 'rest'
				}
			],
			clientPermissions: ['BAN_MEMBERS'],
			userPermissions: ['BAN_MEMBERS'],
			channelRestriction: 'guild',
			description: {
				content: 'Ban user',
				usage: '[@user]',
				examples: ['@user big dumb dumb']
			}
		});
	}

	async exec(message, args) {
		let member = args.member;
		let reasons = args.reasons;

		if(member == this.client) 
			return message.channel.send('Cant ban me fool');
		if(!reasons)
			reasons = 'Nothing have been specified';
		if(member.id === message.author.id)
			return message.channel.send('Why would you ban yourself ?');

		await member.send(`https://youtu.be/55-mHgUjZfY\nYou have been banned from **${message.guild.name}** for the following reasons: "**${reasons}**"`);
		return member.ban(`Banned by : ${message.author.username} for the following reasons : ${reasons}`)
			.then(() => message.reply(`${member.user.username} was succesfully banned with the following reasons "${reasons}".`));
	}
}

module.exports = BanCommand;