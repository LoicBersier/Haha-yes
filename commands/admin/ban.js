const { Command } = require('discord-akairo');

class BanCommand extends Command {
	constructor() {
		super('ban', {
			aliases: ['ban'],
			category: 'admin',
			args: [
				{
					id: 'user',
					type: 'string',
					prompt: {
						start: 'which user do you want to ban?',
						retry: 'This doesn\'t look like a user, please try again!'
					}
				},
				{
					id: 'reasons',
					type: 'string',
					prompt: {
						start: 'For what reasons?',
						optional: true
					},
					match: 'rest'
				}
			],
			clientPermissions: ['BAN_MEMBERS', 'SEND_MESSAGES'],
			userPermissions: ['BAN_MEMBERS'],
			channel: 'guild',
			description: {
				content: 'Ban user | For hackban precise the userid',
				usage: '[@user] [reason] OR [userID] [reason]',
				examples: ['@user big dumb dumb', 'userID hackban']
			}
		});
	}

	async exec(message, args) {
		let reasons = args.reasons;
		let user = args.user;
		if (message.mentions.members.first())
			user = message.mentions.members.first().id;

		if(user === this.client.user.id) 
			return message.channel.send('Can\'t ban me fool!');
		if(!reasons)
			reasons = 'Nothing have been specified';
		if(user === message.author.id)
			return message.channel.send('Why would you ban yourself ?');

		if (message.mentions.members.first()) {
			user = message.mentions.members.first();
			await user.send(`You have been banned from **${message.guild.name}** for the following reasons: "**${reasons}**"`, {files: ['./asset/vid/You_Have_Been_Banned_From_Mickey_Mouse_Club.mp4']})
				.catch(() => console.log('could not send message to the concerned user'));

			return user.ban({reason: `Banned by : ${message.author.username} for the following reasons : ${reasons}`})
				.then(() => message.reply(`${user.user.username} was succesfully banned with the following reasons "${reasons}".`))
				//.catch(() => message.reply('Uh oh, an error has occurred! can the bot ban this user?'));
				.catch(err => console.error(err));

		} else {
			message.guild.members.ban(user, {reason: `Banned by : ${message.author.username} for the following reasons : ${reasons}`})
				.then(() => message.reply(`user ID ${args.user} was succesfully hackbanned with the following reasons "${reasons}".`))
				//.catch(() => message.reply('Uh oh, an error has occurred! can the bot ban this user?'));
				.catch(err => console.error(err));
		}
	}
}

module.exports = BanCommand;