const { Command } = require('discord.js-commando');

module.exports = class BSEspamCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'bsespam',
            group: 'reserved',
            memberName: 'bsespam',
            description: `FOR Big Snow Energy only\nSpam the text you send`,
            throttling: {
                usages: 2,
                duration: 3600,
            },
            args: [
                {
                    key: 'number',
                    prompt: 'How many times do you want to repeat it?',
                    type: 'integer',
                    validate: number => number < 11,
                    default: '1'
                },
                {
                    key: 'text',
                    prompt: 'What do you want me to say',
                    type: 'string',
                }
            ]
        });
    }

    async run(message, { number, text }) {
        if (message.author.id != "428387534842626048")
            return message.say('Command only available to **Big Snow Energy**')

        for(let i = 0; i < number; i++) {
        message.say(text);
        }
        message.say('Finished :)');
    }
};