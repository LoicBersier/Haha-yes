const { Command } = require('discord.js-commando');
const responseObject = require("../../json/randVid.json");
const blacklist = require('../../json/blacklist.json')

module.exports = class dankCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'dank',
            group: 'fun',
            memberName: 'dank',
            description: `send some random dank vid (yea sorry for that name). There is currently **${Object.keys(responseObject).length}** vid`,
        });
    }

    async run(message) {
        if(blacklist[message.author.id])
        return message.channel.send("You are blacklisted")
        const number = Object.keys(responseObject).length;
        const vidNumber = Math.floor (Math.random() * (number - 1 + 1)) + 1;
            message.channel.send(`${vidNumber}: ${responseObject[vidNumber]}`);
          }
};