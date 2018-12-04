const { Command } = require('discord.js-commando');
const { supportServer } = require('../../config.json')
const SelfReloadJSON = require('self-reload-json');
const blacklist = require('../../blacklist');
module.exports = class InviteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'invite',
            group: 'utility',
            memberName: 'invite',
            description: 'Send invite to add the bot',
        });
    }

    async run(message) {
        let blacklistJson = new SelfReloadJSON('./json/blacklist.json');
        if(blacklistJson[message.author.id])
        return blacklist(blacklistJson[message.author.id] , message)
        
        message.say('Check your dm')
        return message.author.send(`You can add me from here: https://discordapp.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot&permissions=0\nYou can also join my support server over here: ${supportServer} come and say hi :)`);
    }
};