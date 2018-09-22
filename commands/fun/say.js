const { Command } = require('discord.js-commando');
module.exports = class sayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'say',
            group: 'fun',
            memberName: 'say',
            description: `Repeat the text you send`,
            args: [
                {
                    key: 'text',
                    prompt: 'What do you want me to say',
                    type: 'string',
                }
            ]
        });
    }

    async run(message, { text }) {
            message.delete();
            message.say(text);
          }
};