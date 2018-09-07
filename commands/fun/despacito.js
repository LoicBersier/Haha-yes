const { Command } = require('discord.js-commando');
module.exports = class DespacitoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'despacito',
            group: 'fun',
            memberName: 'despacito',
            description: 'despacito, what where you excepting?',
        });
    }

    run(message) {
        return message.say('https://www.youtube.com/watch?v=W3GrSMYbkBE');
    }
};