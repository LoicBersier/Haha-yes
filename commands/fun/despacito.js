const { Command } = require('discord.js-commando');
const responseObject = require("../../randVid.json");
module.exports = class DespacitoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'despacito',
            group: 'fun',
            memberName: 'despacito',
            description: `despacito, what where you excepting? There is currently **${Object.keys(responseObject).length}** vid`,
        });
    }

    async run(message) {
        const number = Object.keys(responseObject).length;
        const vidNumber = Math.floor (Math.random() * (number - 1 + 1)) + 1;
            message.channel.send(`${vidNumber}: ${responseObject[vidNumber]}`);
          }
};