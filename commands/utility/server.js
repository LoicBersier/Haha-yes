const { Command } = require('discord.js-commando');
const SelfReloadJSON = require('self-reload-json');
const blacklist = require('../../blacklist');
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
        let blacklistJson = new SelfReloadJSON('./json/blacklist.json');
        if(blacklistJson[message.author.id])
        return blacklist(blacklistJson[message.author.id] , message)
        
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