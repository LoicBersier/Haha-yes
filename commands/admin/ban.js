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

    async run(message, { member, reasons }) {
        if(member == this.client) 
            return message.say('Cant kick me fool')
        if(!reasons)
            reasons = 'Nothing have been specified'
        if(member.id === message.author.id)
            return message.say("Why would you ban yourself ?")
        await member.send(`https://youtu.be/55-mHgUjZfY\nYou have been banned for the following reasons: "${reasons}"`)
        .error(err => console.error(`Could not dm the user, probably disabled\n${err}`))
        member.ban(`Banned by : ${message.author.username} for the following reasons : ${reasons}`)
            .then(() => message.reply(`${member.user.username} was succesfully banned with the following reasons "${reasons}".`))

        };
};