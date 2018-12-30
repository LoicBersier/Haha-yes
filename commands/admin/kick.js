const { Command } = require('discord-akairo');

class KickCommand extends Command {
    constructor() {
        super('kick', {
           aliases: ['kick'],
           category: 'admin',
           split: 'quoted',
           args: [
               {
                   id: 'member',
                   type: 'member'
               },
               {
                   id: 'reasons',
                   type: 'string'
               }
           ],
           clientPermissions: ['KICK_MEMBERS'],
           userPermissions: ['KICK_MEMBERS'],
           channelRestriction: 'guild',
           description: {
            content: 'Kick user',
            usage: '[@user]',
            examples: ['@user big dumb dumb']
        }
        });
    }

    async exec(message, args) {
        let member = args.member;
        let reasons = args.reasons;

        if(member === this.client.user) 
            return message.channel.say('Cant kick me fool');
        if(member.id === message.author.id)
            return message.channel.say("Why would you kick yourself ?");
        if(!reasons)
            reasons = 'Nothing have been specified.';

        await member.kick(`Kicked by : ${message.author.username} for the following reasons : ${reasons}`)
        .then(() => message.reply(`${member.user.username} was succesfully kicked with the following reasons "${reasons}".`))
        .catch(err => console.error(err))
    }
}

module.exports = KickCommand;