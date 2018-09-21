const { Command } = require('discord.js-commando');
module.exports = class ServerCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'server',
            group: 'utility',
            guildOnly: 'true',
            memberName: 'server',
            description: 'Show some stats about the server',
            guildOnly: true,
        });
    }

    async run(message) {
    const addEmbed = {
        color: 0x0099ff,
        title: 'Stats of the server',
        thumbnail: {
        url: `${message.guild.iconURL}`,
    },
        description: `Member: **${message.guild.memberCount}** \nChannel number: **${message.guild.channels.size}**\nGuild created at **${message.guild.createdAt}**\nOwner: **${message.guild.owner}**`,
    };
    
    message.say({ embed: addEmbed });
    }
};