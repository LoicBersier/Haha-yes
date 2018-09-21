const { Command } = require('discord.js-commando');
module.exports = class PruneCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'prune',
            aliases: ['purge', 'clear', 'clean'],
            group: 'admin',
            memberName: 'prune',
            description: 'Bulk delete messages.',
            clientPermissions: ['READ_MESSAGE_HISTORY', 'MANAGE_MESSAGES'],
            userPermissions: ['MANAGE_MESSAGES'],
            guildOnly: true,
            args: [
                {
                    key: 'amount',
                    prompt: 'How many messages would you like to delete? ( choose a number between 1 & 99 )',
                    type: 'integer',
                    min: '1',
                    max: '99'
                }
            ]
        });
    }

    run(message, { amount }) {
        amount = amount+1
        message.channel.bulkDelete(amount, true);
    }
};

