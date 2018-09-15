const { Command } = require('discord.js-commando');
module.exports = class DedCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ded',
            aliases: ['shutdown', 'dead', 'restart', 'reboot'],
            group: 'owner',
            memberName: 'ded',
            description: 'Reboot the bot',
            ownerOnly: true,
        });
    }

    async run(message) {
        await message.say('https://i.redd.it/lw8hrvr0l4f11.jpg');
        process.exit();
}}