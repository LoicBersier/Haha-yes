const { Command } = require('discord.js-commando');
const SelfReloadJSON = require('self-reload-json');
const blacklist = require('blacklist');
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
        let blacklistJson = new SelfReloadJSON('../../json/blacklist.json');
        if(blacklistJson[message.author.id])
        return blacklist(blacklistJson[message.author.id] , message)
        
            message.delete();
            message.say(text);
          }
};