const { Command } = require('discord.js-commando');
const responseObject = require("../../funFact.json");
module.exports = class FunFactCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'funfact',
            group: 'fun',
            memberName: 'funfact',
            description: 'Replies with a some fun fact.',
        });
    }

    run(message) {
        const number = 2;
        const funFactNumber = Math.floor (Math.random() * (number - 1 + 1)) + 1;
            message.channel.send(`Fun fact: ${responseObject[funFactNumber]}`);
    }
};