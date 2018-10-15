const { Command } = require('discord.js-commando');
const { supportServer } = require('../../config.json')
const blacklist = require('../../json/blacklist.json')

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
        if(blacklist[message.author.id])
        return message.channel.send("You are blacklisted")
        return message.say(`You can add me from here: https://discordapp.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot&permissions=0\nYou can also join my support server over here: ${supportServer} come and say hi :)`);
    }
};