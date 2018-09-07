const { Command } = require('discord.js-commando');
module.exports = class KickCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'kick',
            group: 'admin',
            memberName: 'kick',
            description: 'Kick the mentionned user',
            guildOnly: true,
            clientPermissions: ['ADMINISTRATOR'],
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

    run(message) {
        const member = message.mentions.members.first();
        member.kick(reason.join(" ")).then(member => {
            message.reply(`${member.user.username} was succesfully banned.`);
        });
    }
};