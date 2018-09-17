const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
module.exports = class ServerCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'server',
            group: 'utility',
            memberName: 'server',
            description: 'very yes',
        });
    }

    async run(message) {
        const serverStatsEmbed = new Discord.RichEmbed()
    .setColor('#0099ff')
    .setTitle('Stats of the server')
    .setDescription('Some description here')
    .setThumbnail(message.guild.iconURL)
    .addField(`Member: **${message.guild.memberCount}** \n Channel: **${message.guild.channels}**`)
    .addBlankField()
    .setTimestamp()

    message.say(serverStatsEmbed);
    }
};