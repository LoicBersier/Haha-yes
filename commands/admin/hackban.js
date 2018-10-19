const { Command } = require('discord.js-commando');
module.exports = class BanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'hackban',
            group: 'admin',
            memberName: 'hackban',
            description: 'ban the id of the user even if they are not in the server',
            guildOnly: true,
            clientPermissions: ['BAN_MEMBERS'],
            userPermissions: ['BAN_MEMBERS'],
            args: [
                {
                    key: 'user',
                    prompt: 'Wich user would you like to ban?',
                    type: 'user',
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

    async run(message, { user, reasons }) {
        if(!reasons)
            reasons = 'Nothing have been specified'
        if(user.id === message.author.id)
            return message.say("Why would you ban yourself ?")
        message.guild.ban(user, `Banned by : ${message.author.username} for the following reasons : ${reasons}`)
            .then(() => message.reply(`${user} was succesfully banned with the following reasons "${reasons}".`));
        };
};