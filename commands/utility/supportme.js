const { Command } = require('discord.js-commando');
const blacklist = require('../../json/blacklist.json')

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
        if(blacklist[message.author.id])
        return message.channel.send("You are blacklisted")
            message.say('If you want to support me and my bot you can donate here\nhttps://donatebot.io/checkout/487640086859743232\n(This is totally optional dont feel forced to do it)');
          }
};