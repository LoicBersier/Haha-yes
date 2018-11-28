const { Command } = require('discord.js-commando');
const blacklist = require('../../json/blacklist.json')

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
        if(blacklist[message.author.id])
        return message.channel.send("You are blacklisted")
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