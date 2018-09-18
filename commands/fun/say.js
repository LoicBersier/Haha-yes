const { Command } = require('discord.js-commando');
const responseObject = require("../../randVid.json");
module.exports = class sayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'say',
            group: 'fun',
            memberName: 'say',
            description: `repeat the text`,
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