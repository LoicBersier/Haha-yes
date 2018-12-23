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
        if(member == this.client) 
            message.say('Cant kick me fool')
        if(!reasons)
            reasons = 'Nothing have been specified.'
        if(member.id === message.author.id)
            return message.say("Why would you kick yourself ?")
        await member.send(`You have been kicked for the following reasons: "${reasons}"`)
        .error(err => console.error(`Could not dm the user, probably disabled\n${err}`))
        member.kick(`Kicked by : ${message.author.username} for the following reasons : ${reasons}`)
        .then(() => message.reply(`${member.user.username} was succesfully kicked with the following reasons "${reasons}".`))
        };
};