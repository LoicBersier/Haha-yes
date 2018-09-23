const { Command } = require('discord.js-commando');
const emojiCharacters = require('../../emojiCharacters');
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
        let textChar = text.toLowerCase().split('')
        let i = text.length;
        let emojiArray = [];
        message.delete();
        for (i = 0; i < text.length; i++) {
            emojiArray[i] = emojiCharacters[textChar[i]];
        }
        let finalText = emojiArray.join("");
        message.say(finalText)
        

    }
};