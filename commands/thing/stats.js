const { Command } = require('discord.js-commando');
module.exports = class MeowCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'stats',
            group: 'thing',
            memberName: 'stats',
            description: 'Show bot stats.',
        });
    }

    run(message) {
        return message.channel.send(`Servers: ${this.client.guilds.size}\nChannels: ${this.client.channels.size}\nUsers : ${this.client.users.size}`);
    }
};