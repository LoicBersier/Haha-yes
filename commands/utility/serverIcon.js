const { Command } = require('discord-akairo');

class serverIconCommand extends Command {
	constructor() {
		super('serverIcon', {
			aliases: ['serverIcon'],
			category: 'utility',
			clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
			channel: 'guild',
			args: [
				{
					id: 'serverid',
					type: 'integer'
				}
			],
			description: {
				content: 'Show the server icon from other guild (require there ID)',
				usage: '(optional) [server id]',
				examples: ['', '487640086859743232']
			}
		});
	}

	async exec(message, args) {
		const serverEmbed = this.client.util.embed()
			.setColor(message.member ? message.member.displayHexColor : 'NAVY')
			.setTitle('Server icon');


		if (!args.serverid) {
			let format = message.guild.iconURL().substr(message.guild.iconURL().length - 3);
			if (format == 'gif') {
				serverEmbed.setAuthor(message.guild.name);
				serverEmbed.setDescription(`[gif](${message.guild.iconURL({ format: 'gif', size: 2048 })})`);
				serverEmbed.setImage(message.guild.iconURL({ format: 'gif', size: 2048 }));
			} else {
				serverEmbed.setAuthor(message.guild.name);
				serverEmbed.setDescription(`[png](${message.guild.iconURL({ format: 'png', size: 2048 })}) | [jpeg](${message.guild.iconURL({ format: 'jpg', size: 2048 })}) | [webp](${message.guild.iconURL({ format: 'webp', size: 2048 })})`);
				serverEmbed.setImage(message.guild.iconURL({ format: 'png', size: 2048 }));
			}
			return message.reply({embed: serverEmbed});
		} else {
			let format = this.client.guilds.find(guild => guild.id == args.serverid).iconURL().substr(this.client.guilds.find(guild => guild.id == args.serverid).iconURL().length - 3);
			if (format == 'gif') {
				serverEmbed.setAuthor(this.client.guilds.find(guild => guild.id == args.serverid).name);
				serverEmbed.setDescription(`[gif](${this.client.guilds.find(guild => guild.id == args.serverid).iconURL({ format: 'gif', size: 2048 })})`);
				serverEmbed.setImage(this.client.guilds.find(guild => guild.id == args.serverid).iconURL({ format: 'gif', size: 2048 }));
			} else {
				serverEmbed.setAuthor(this.client.guilds.find(guild => guild.id == args.serverid).name);
				serverEmbed.setDescription(`[png](${this.client.guilds.find(guild => guild.id == args.serverid).iconURL({ format: 'png', size: 2048 })}) | [jpeg](${this.client.guilds.find(guild => guild.id == args.serverid).iconURL({ format: 'jpg', size: 2048 })}) | [webp](${this.client.guilds.find(guild => guild.id == args.serverid).iconURL({ format: 'webp', size: 2048 })})`);
				serverEmbed.setImage(this.client.guilds.find(guild => guild.id == args.serverid).iconURL({ format: 'png', size: 2048 }));
			}
			return message.reply({embed: serverEmbed});
		}
	}
}

module.exports = serverIconCommand;