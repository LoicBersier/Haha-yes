const { Command } = require('discord.js-commando');
const { feedbackChannel } = require('../../config.json');
module.exports = class feedbackCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'feedback',
            group: 'utility',
            memberName: 'feedback',
            description: `Send feedback`,
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
        const channel = this.client.channels.get(feedbackChannel);
        channel.send(`from ${message.author}: ${text}`);
            message.say('Your feedback has been sent!');
          }
};