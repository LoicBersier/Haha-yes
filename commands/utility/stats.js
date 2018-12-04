const { Command } = require('discord.js-commando');
const SelfReloadJSON = require('self-reload-json');

module.exports = class statsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'stats',
            group: 'utility',
            memberName: 'stats',
            description: 'Show bot stats.',
        });
    }

    async run(message) {
        let blacklistJson = new SelfReloadJSON('DiscordBot/json/blacklist.json');
        if(blacklistJson[message.author.id])
        return blacklist(blacklistJson[message.author.id] , message)
        
        let totalSeconds = (this.client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds.toFixed(0) % 60;
        let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
        return message.channel.send(`Servers: \`${this.client.guilds.size}\`\nChannels: \`${this.client.channels.size}\`\nUsers: \`${this.client.users.size}\`\nBot uptime: \`${uptime}\``);
    }
};