const { Command } = require('discord.js-commando');
module.exports = class StatusCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'status',
            group: 'owner',
            memberName: 'status',
            description: 'Change the status of the bot',
            ownerOnly: true,
            args: [
                {
                    key: 'status',
                    prompt: 'Wich status should i have?',
                    type: 'string',
                }
            ]
        });
    }

    async run(message, { status }) {
        this.client.user.setActivity(status);
        message.say(`Status have been set to ${status}`);
    }
};