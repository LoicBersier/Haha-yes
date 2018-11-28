const { Command } = require('discord.js-commando');
const emojiCharacters = require('../../emojiCharacters');
const SelfReloadJSON = require('self-reload-json');
const blacklist = require('../../blacklist');
module.exports = class emoteSayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'emotesay',
            group: 'fun',
            memberName: 'emotesay',
            description: `repeat the text in dancing letters`,
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
        let emojiArray = [];
        for (let i = 0; i < text.length; i++)
            emojiArray[i] = emojiCharacters[text.toLowerCase().split('')[i]];
        message.say(emojiArray.join(""))
        

    }
};