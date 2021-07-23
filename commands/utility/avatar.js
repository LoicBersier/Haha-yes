const { Command } = require('discord-akairo');

class AvatarCommand extends Command {
	constructor() {
		super('avatar', {
			aliases: ['avatar', 'avy'],
			category: 'utility',
			clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
			args: [
				{
					id: 'user',
					type: 'user'
				}
			],
			description: {
				content: 'Show avatar of the mentioned user or you',
				usage: '(optional) [@user]',
				examples: ['', '@user', 'username']
			}
		});
	}

	async exec(message, args) {
		const avatarEmbed = this.client.util.embed()
			.setColor(message.member ? message.member.displayHexColor : 'NAVY')
			.setTitle('Avatar');


		if (!args.user) {
			let format = message.author.displayAvatarURL({ dynamic: true }).substr(message.author.displayAvatarURL({ dynamic: true }).length - 3);
			console.log(format);
			if (format == 'gif') {
				avatarEmbed.setAuthor(message.author.username);
				avatarEmbed.setDescription(`[gif](${message.author.displayAvatarURL({ format: 'gif', size: 2048 })})`);
				avatarEmbed.setImage(message.author.displayAvatarURL({ format: 'gif', size: 2048 }));
			} else {
				avatarEmbed.setAuthor(message.author.username);
				avatarEmbed.setDescription(`[png](${message.author.displayAvatarURL({ format: 'png', size: 2048 })}) | [jpeg](${message.author.displayAvatarURL({ format: 'jpg', size: 2048 })}) | [webp](${message.author.displayAvatarURL({ format: 'webp', size: 2048 })})`);
				avatarEmbed.setImage(message.author.displayAvatarURL({ format: 'png', size: 2048 }));
			}
			return message.reply({embed: avatarEmbed});
		} else {
			let format = args.user.displayAvatarURL({ dynamic: true }).substr(args.user.displayAvatarURL({ dynamic: true }).length - 3);
			console.log(format);
			if (format == 'gif') {
				avatarEmbed.setAuthor(args.user.username);
				avatarEmbed.setDescription(`[gif](${args.user.displayAvatarURL({ format: 'gif', size: 2048 })})`);
				avatarEmbed.setImage(args.user.displayAvatarURL({ format: 'gif', size: 2048 }));
			} else {
				avatarEmbed.setAuthor(args.user.username);
				avatarEmbed.setDescription(`[png](${args.user.displayAvatarURL({ format: 'png', size: 2048 })}) | [jpeg](${args.user.displayAvatarURL({ format: 'jpg', size: 2048 })}) | [webp](${args.user.displayAvatarURL({ format: 'webp', size: 2048 })})`);
				avatarEmbed.setImage(args.user.displayAvatarURL({ format: 'png', size: 2048 }));
			}
			return message.reply({embed: avatarEmbed});
		}
	}
}

module.exports = AvatarCommand;