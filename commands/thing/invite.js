const { Command } = require('discord.js-commando');
module.exports = class InviteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'invite',
            group: 'thing',
            memberName: 'invite',
            description: 'Send invite to add the bot',
        });
    }

    run(message) {
        return message.say('You can add me from here \nhttps://discordapp.com/oauth2/authorize?client_id=487342817048264704&scope=bot&permissions=2054');
    }
};