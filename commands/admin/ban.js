const { Command } = require('discord.js-commando');
module.exports = class BanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ban',
            group: 'admin',
            memberName: 'ban',
            description: 'ban the mentionned user',
            guildOnly: true,
            clientPermissions: ['BAN_MEMBERS'],
            userPermissions: ['BAN_MEMBERS'],
            args: [
                {
                    key: 'member',
                    prompt: 'Wich member would you like to ban?',
                    type: 'member',
                }
            ]
        });
    }

    async run(message) {
        const member = message.mentions.members.first();
        member.ban(reason.join(" ")).then(member => {
            message.reply(`${member.user.username} was succesfully banned.`);
        });
    }
};