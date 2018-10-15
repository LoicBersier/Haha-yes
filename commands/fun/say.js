const { Command } = require('discord.js-commando');
const blacklist = require('../../json/blacklist.json')

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
        if(blacklist[message.author.id])
        return message.channel.send("You are blacklisted")
            message.delete();
            message.say(text);
          }
};