const { Command } = require('discord.js-commando');

module.exports = class CustomResponseCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'slowmode',
            aliases: ['slow'],
            group: 'admin',
            memberName: 'slowmode',
            description: `Custom auto response`,
            userPermissions: ['MANAGE_CHANNELS'],
            clientPermissions: ['MANAGE_CHANNELS'],
            args: [
                {
                    key: 'slowmodeNumber',
                    prompt: 'How many seconds should the slowmode be? ( 0 to remove it )',
                    type: 'integer',
                },
                {
                    key: 'realtime',
                    prompt: 'How long shoud it remain',
                    default: '',
                    type: 'integer',
                }
            ]
        });
    }

    async run(message, { slowmodeNumber, realtime }) {
        if (slowmodeNumber > 120)
            return message.say("Slowmode can only be set to 120 seconds or lower!");

        message.channel.setRateLimitPerUser(slowmodeNumber);

        if (realtime) {
            let time = 60000 * realtime;
            message.say(`Slowmode have been set to ${slowmodeNumber} seconds and will end in ${realtime} minutes!`);
            var interval = setInterval (function (){
                message.channel.setRateLimitPerUser(0);
                message.say("Slowmode is now disabled!")
             }, time);
        } else {
            if (slowmodeNumber == 0)
                return message.say("Slowmode have been disabled!")
            return message.say(`Slowmode have been set to ${slowmodeNumber} seconds!`);
        }

        

        }
};