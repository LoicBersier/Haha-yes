const { Command } = require('discord.js-commando');
module.exports = class BotavatarCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'botavatar',
            group: 'owner',
            memberName: 'botavatar',
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