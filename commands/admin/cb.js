const { Command } = require('discord.js-commando');
const blacklist = require('../../json/blacklist.json');

module.exports = class cbCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'cb',
            group: 'admin',
            memberName: 'cb',
            description: 'spam a bunch of dot to quickly make something disspear',
            userPermissions: ['MANAGE_MESSAGES'],
            guildOnly: true,
        });
    }

    run(message) {
       message.say('.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.')
    }
};

