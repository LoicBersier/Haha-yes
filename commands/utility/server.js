const { Command } = require('discord-akairo');

class ServerCommand extends Command {
    constructor() {
        super('server', {
            aliases: ['server', 'serverinfo'],
            category: 'utility',
            channelRestriction: 'guild',
            description: {
				content: 'Show info about the server',
				usage: '',
				examples: ['']
			}
        });
    }

    async exec(message) {
        try {
            const customresponse = require(`../tag/${message.guild.id}.json`);
            var count = Object.keys(customresponse).length
        } catch {
            var count = 'None'
        }
        
        
        const addEmbed = {
        color: 0x0099ff,
        title: 'Stats of the server',
        thumbnail: {
        url: `${message.guild.iconURL}`,
        },
        description: `Member: **${message.guild.memberCount}** \nChannel number: **${message.guild.channels.size}**\nGuild created at **${message.guild.createdAt}**\nOwner: **${message.guild.owner}**\nTag number: **${count}**`,
        };
        
        message.channel.send({ embed: addEmbed });
    }
}

module.exports = ServerCommand;