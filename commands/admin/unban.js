const { Command } = require('discord.js-commando');
module.exports = class UnbanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'unban',
            group: 'admin',
            memberName: 'unban',
            description: 'unban the provided id',
            guildOnly: true,
            clientPermissions: ['BAN_MEMBERS'],
            userPermissions: ['BAN_MEMBERS'],
            args: [
                {
                    key: 'member',
                    prompt: 'Wich member would you like to unban?',
                    type: 'user',
                }
            ]
        });
    }

    async run(message, { member }) {
        message.guild.unban(member)
            .then(() => message.reply(`user was succesfully unbanned.`));
        };
};