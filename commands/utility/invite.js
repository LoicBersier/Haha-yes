const { Command } = require('discord.js-commando');
const { supportServer } = require('../../config.json')
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
        return message.say(`You can add me from here: https://discordapp.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot&permissions=0\nYou can join my support server over here: ${supportServer} come and say hi :)`);
    }
};