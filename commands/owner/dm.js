const { Command } = require('discord.js-commando');
module.exports = class dmCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'dm',
            group: 'owner',
            memberName: 'dm',
            description: 'Dm the user id',
            ownerOnly: true,
            args: [
                {
                    key: 'id',
                    prompt: 'Wich user would you like to dm?',
                    type: 'string',
                },
                {
                    key: 'text',
                    prompt: 'Wich user would you like to dm?',
                    type: 'string',
                }
            ]
        });
    }

    async run(message, { id, text }) {
        const user = this.client.users.get(id);
        user.send(`**Message from the dev**\n${text}`)
        message.send('DM sent')
    }
};