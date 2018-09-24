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
            guildOnly: true,
            args: [
                {
                    key: 'member',
                    prompt: 'Wich member would you like to ban?',
                    type: 'member',
                }
            ]
        });
    }

    async run(message, { member }) {
        if(member.id === message.author.id) {
            message.say("Why would you ban yourself ?")
        } else
        member.ban().then(member => {
            message.reply(`${member.user.username} was succesfully banned.`);

            //TODO
            //Send a message when the bot didint manage to kick
        });
    }
};