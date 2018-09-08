const { Command } = require('discord.js-commando');
module.exports = class YesCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'yes',
            group: 'fun',
            memberName: 'yes',
            description: 'very yes',
        });
    }

    run(message) {
        return message.say('haha very yes');
    }
};