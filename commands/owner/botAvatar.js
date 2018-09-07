const { Command } = require('discord.js-commando');
module.exports = class BotAvatarCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'botAvatar',
            group: 'owner',
            memberName: 'botAvatar',
            description: 'Change the avatar of the bot',
            ownerOnly: true,
            args: [
                {
                    key: 'pic',
                    prompt: 'Wich avatar should i have?',
                    type: 'string',
                }
            ]
        });
    }

    run(message, { pic }) {
        this.client.user.setAvatar(pic);
    }
};