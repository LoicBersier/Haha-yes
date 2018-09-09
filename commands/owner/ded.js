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

    run(message) {
        message.say("i dont work :(");
        process.exit();
}}