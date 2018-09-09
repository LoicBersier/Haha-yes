const { Command } = require('discord.js-commando');
const responseObject = require("../../randVid.json");
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
        const number = 5;
        const vidNumber = Math.floor (Math.random() * (number - 1 + 1)) + 1;
            message.channel.send(`${vidNumber}: ${responseObject[vidNumber]}`);
          }
};