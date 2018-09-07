const { Command } = require('discord.js-commando');
module.exports = class PruneCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'prune',
            group: 'fun',
            memberName: 'prune',
            description: 'Replies with a meow, kitty cat.',
            clientPermissions: ['MANAGE_MESSAGES'],
            userPermissions: ['MANAGE_MESSAGES'],
            args: [
                {
                    key: 'amount',
                    prompt: 'How many messages would you like to delete?',
                    type: 'integer',
                }
            ]
        });
    }

    run(message, { amount }) {
        if (amount < 2 || amount > 100) {
            return message.reply('you need to input a number between 2 and 100.');
        }
        message.channel.bulkDelete(amount, true);
    }
};