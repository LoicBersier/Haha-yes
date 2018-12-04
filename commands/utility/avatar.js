const { Command } = require('discord.js-commando');
const SelfReloadJSON = require('self-reload-json');
const blacklist = require('../../blacklist');

module.exports = class AvatarCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'avatar',
            group: 'utility',
            memberName: 'avatar',
            description: 'Send the avatar of the mentionned user.',
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
        let blacklistJson = new SelfReloadJSON('./json/blacklist.json');
        if(blacklistJson[message.author.id])
        return blacklist(blacklistJson[message.author.id] , message)
        
        if (!user)
            return message.say(`Your avatar:\n${message.author.displayAvatarURL}`);
        else
            return message.say(`${user.username}'s avatar:\n${user.displayAvatarURL}`);
    }
};