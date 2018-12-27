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
                }
            ]
        });
    }

    async run(message, { slowmodeNumber }) {
        message.channel.setRateLimitPerUser(slowmodeNumber);
        message.say(`Slowmode have been set to ${slowmodeNumber} seconds`);
        }
};