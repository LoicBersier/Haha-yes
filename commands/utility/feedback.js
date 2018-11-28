const { Command } = require('discord.js-commando');
const { feedbackChannel } = require('../../config.json');
const SelfReloadJSON = require('self-reload-json');
const blacklist = require('../../blacklist');
const fs = require('fs');
module.exports = class feedbackCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'feedback',
            group: 'utility',
            memberName: 'feedback',
            description: `Send feedback ( if you abuse you will get blacklisted )`,
            throttling: {
                usages: 2,
                duration: 60,
            },
            args: [
                {
                    key: 'text',
                    prompt: 'What would you want to send as feedback?',
                    type: 'string',
                }
            ]
        });
    }

    async run(message, { text }) {
        let blacklistJson = new SelfReloadJSON('../../json/blacklist.json');
        if(blacklistJson[message.author.id])
        return blacklist(blacklistJson[message.author.id] , message)
        
        const channel = this.client.channels.get(feedbackChannel);
        channel.send(`from ${message.author.username} (${message.author.id}) : ${text}`);
            message.say('Your feedback has been sent!');
    }
};