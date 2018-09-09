const { Command } = require('discord.js-commando');
module.exports = class PruneCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'prune',
            aliases: ['purge'],
            group: 'admin',
            memberName: 'prune',
            description: 'Bulk delete messages.',
            clientPermissions: ['MANAGE_MESSAGES'],
            userPermissions: ['MANAGE_MESSAGES'],
        });
    }

    async run(message, args) {
        const amount = parseInt(args[0]) + 1;

        if (isNaN(amount)) {
            return message.reply('that dosen\'t seem to be a valid number.');
        }
        else if (amount <= 1 || amount > 100) {
            return message.reply('you need to input a number between 1 and 99.');
        }
        message.channel.bulkDelete(amount, true).catch(err => {
            console.error(err);
            message.channel.send('there was an error trying to prune messages in this channel!');
        });
}}