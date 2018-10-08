const { Command } = require('discord.js-commando');
module.exports = class supportMeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'supportme',
            group: 'utility',
            memberName: 'supportme',
            description: `Support me and my bot`,
        });
    }

    async run(message, { text }) {
            message.say('If you want to support me and my bot you can donate here\nhttps://donatebot.io/checkout/487640086859743232\n(This is totally optionnal dont feel forced to do it)');
          }
};