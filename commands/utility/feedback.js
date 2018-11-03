const { Command } = require('discord.js-commando');
const { feedbackChannel } = require('../../config.json');
const blacklist = require('../../json/blacklist.json')

const fs = require('fs');
module.exports = class feedbackCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'feedback',
            group: 'utility',
            memberName: 'feedback',
            description: `Send feedback`,
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
        if(blacklist[msg.author.id])
        return message.channel.send("You are blacklisted")
        const channel = this.client.channels.get(feedbackChannel);
        channel.send(`from ${message.author.username} (${message.author} : ${message.author.id}): ${text}`);
            message.say('Your feedback has been sent!');
    }
};