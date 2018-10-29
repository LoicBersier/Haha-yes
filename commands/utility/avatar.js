const { Command } = require('discord.js-commando');
const blacklist = require('../../json/blacklist.json')

module.exports = class AvatarCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'avatar',
            group: 'utility',
            memberName: 'avatar',
            description: 'Send the avatar of the mentionned user.',
        });
    }

    async run(message, { user }) {
        if(blacklist[message.author.id])
        return message.channel.send("You are blacklisted")
        if (!user)
            return message.say(`Your avatar:\n${message.author.displayAvatarURL}`);
        else
            return message.say(`${user.username}'s avatar:\n${user.displayAvatarURL}`);
    }
};