const { Command } = require('discord.js-commando');
module.exports = class dmCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'emit',
            group: 'owner',
            memberName: 'emit',
            aliases: ['event', 'emitevent'],
            description: 'Trigger an event',
            ownerOnly: true,
            args: [
                {
                    key: 'event',
                    prompt: 'Wich event do you want to trigger?',
                    type: 'string',
                }
            ]
        });
    }

    async run(message, { event }) {
        this.client.emit(`${event}`);
    }
};