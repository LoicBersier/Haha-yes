const { Command } = require('discord.js-commando');
const responseObject = require("../../json/despacito.json");
module.exports = class DespacitoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'despacito',
            group: 'fun',
            memberName: 'despacito',
            description: `despacito`,
        });
    }

    async run(message) {
        const number = Object.keys(responseObject).length;
        const despacitoNumber = Math.floor (Math.random() * (number - 1 + 1)) + 1;
            message.channel.send({files: [responseObject[despacitoNumber]]});
          }
};