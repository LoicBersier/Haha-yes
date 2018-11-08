const { Command } = require('discord.js-commando');
module.exports = class dmCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'dm',
            group: 'owner',
            memberName: 'dm',
            aliases: ['pm'],
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
                    default: ''
                }
            ]
        });
    }

    async run(message, { id, text }) {
        let Attachment = (message.attachments).array();
        const user = this.client.users.get(id);
        if (Attachment[0]) {
            user.send(`**Message from the dev**\n${text}\n${Attachment[0].url}`)
            message.say('DM sent')
        }
        else {
            user.send(`**Message from the dev**\n${text}`)
            message.say('DM sent')
        }
    }
};