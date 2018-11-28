const { Command } = require('discord.js-commando');
const emojiCharacters = require('../../emojiCharacters');
const blacklist = require('../../json/blacklist.json')

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
        if(blacklist[message.author.id])
        return message.channel.send("You are blacklisted")
        message.delete();
        let emojiArray = [];
        for (let i = 0; i < text.length; i++)
            emojiArray[i] = emojiCharacters[text.toLowerCase().split('')[i]];
        message.say(emojiArray.join(""))
        

    }
};