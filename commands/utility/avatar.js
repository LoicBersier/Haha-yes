const { Command } = require('discord.js-commando');
module.exports = class AvatarCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'avatar',
            group: 'utility',
            memberName: 'avatar',
            description: 'Send the avatar of the mentionned user.',
            memberName: 'say',
            description: `Repeat the text you send`,
            args: [
                {
                    key: 'user',
                    prompt: 'What do you want me to say',
                    type: 'user',
                    default: ''
                }
            ]
        });
    }

    async run(message, { user }) {
        if (!user)
            return message.say(`Your avatar:\n${message.author.displayAvatarURL}`);
        else
            return message.say(`${user.username}'s avatar:\n${user.displayAvatarURL}`);
    }
};