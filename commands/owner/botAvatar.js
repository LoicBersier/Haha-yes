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

    async run(message, { pic }) {
        this.client.user.setAvatar(pic);
        message.say('The avatar have been changed succesfully');
    }
};