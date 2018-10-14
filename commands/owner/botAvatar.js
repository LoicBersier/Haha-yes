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
                    default: ''
                }
            ]
        });
    }

    async run(message, { pic }) {
        let Attachment = (message.attachments).array();
        let image = null
        if (!Attachment[0])
            return message.say('You didint provide any images')
        else 
            image = Attachment[0].url
        this.client.user.setAvatar(image);
        message.say('The avatar have been changed succesfully');
    }
};