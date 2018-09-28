const { Command } = require('discord.js-commando');
module.exports = class KickCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'kick',
            group: 'admin',
            memberName: 'kick',
            description: 'Kick the mentionned user',
            guildOnly: true,
            clientPermissions: ['KICK_MEMBERS'],
            userPermissions: ['KICK_MEMBERS'],
            args: [
                {
                    key: 'member',
                    prompt: 'Wich member would you like to kick?',
                    type: 'member',
                }
            ]
        });
    }

    async run(message, { member }) {
        if(member.id === message.author.id)
            return message.say("Why would you kick yourself ?")
        member.kick()
        .then(() => message.reply(`${member.user.username} was succesfully kicked.`));
        };
};