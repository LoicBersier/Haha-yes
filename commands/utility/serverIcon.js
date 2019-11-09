const { Command } = require('discord-akairo');

class serverIconCommand extends Command {
	constructor() {
		super('serverIcon', {
			aliases: ['serverIcon'],
			category: 'utility',
			clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
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
		if (!args.serverid)
			return message.channel.send('This server icon:', {files: [message.guild.iconURL()]});
		else if (this.client.guilds.find(guild => guild.id == args.serverid))
			return message.channel.send(`${this.client.guilds.find(guild => guild.id == args.serverid).name}`, {files: [this.client.guilds.find(guild => guild.id == args.serverid).iconURL()]});
		else
			return message.channel.send('Could not find any guild, am i in the guild you are trying to get the icon of?'); 
	}
}

module.exports = serverIconCommand;