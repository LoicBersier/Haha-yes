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
                },
                {
                    key: 'reasons',
                    prompt: 'What is the reasons of the kick',
                    type: 'string',
                    default: ''
                } 
            ]
        });
    }

    async run(message, { member, reasons }) {
        if(member.id === message.author.id)
            return message.say("Why would you kick yourself ?")
        member.kick(reasons)
        .then(() => message.reply(`${member.user.username} was succesfully kicked with the following reasons "${reasons}".`));
        };
};