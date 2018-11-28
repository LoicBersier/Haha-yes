const { Command } = require('discord.js-commando');
const SelfReloadJSON = require('self-reload-json');
const blacklist = require('blacklist');
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
        let blacklistJson = new SelfReloadJSON('../../json/blacklist.json');
        if(blacklistJson[message.author.id])
        return blacklist(blacklistJson[message.author.id] , message)
        
            message.say('If you want to support me and my bot you can donate here\nhttps://donatebot.io/checkout/487640086859743232\n(This is totally optional dont feel forced to do it)');
          }
};