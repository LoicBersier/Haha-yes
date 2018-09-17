const { Command } = require('discord.js-commando');
module.exports = class MeowCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'stats',
            group: 'utility',
            memberName: 'stats',
            description: 'Show bot stats.',
        });
    }

    async run(message) {
        let totalSeconds = (this.client.uptime / 1000);
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;
        let uptime = `${hours} hours, ${minutes} minutes and ${seconds} seconds`;
        return message.channel.send(`Servers: \`${this.client.guilds.size}\`\nChannels: \`${this.client.channels.size}\`\nUsers: \`${this.client.users.size}\`\nBot uptime: \`${uptime}\``);
    }
};