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
                    key: 'user',
                    prompt: 'Wich user would you like to dm?',
                    type: 'user',
                },
                {
                    key: 'text',
                    prompt: 'What do you want to say to the user',
                    type: 'string',
                }
            ]
        });
    }

    async run(message, { user, text }) {
        let Attachment = (message.attachments).array();
        if (Attachment[0]) {
            user.send(`**Message from the dev:**\n${text}\n${Attachment[0].url}`)
            message.say(`DM sent to ${user.username}`)
        }
        else {
            user.send(`**Message from the dev:**\n${text}`)
            message.say(`DM sent to ${user.username}`)
        }
    }
};