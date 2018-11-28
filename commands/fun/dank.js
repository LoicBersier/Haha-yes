const { Command } = require('discord.js-commando');
const responseObject = require("../../json/randVid.json");
const SelfReloadJSON = require('self-reload-json');
const blacklist = require('../../blacklist');
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
        let blacklistJson = new SelfReloadJSON('json/blacklist.json');
        if(blacklistJson[message.author.id])
        return blacklist(blacklistJson[message.author.id] , message)
        
        const number = Object.keys(responseObject).length;
        const vidNumber = Math.floor (Math.random() * (number - 1 + 1)) + 1;
            message.channel.send(`${vidNumber}: ${responseObject[vidNumber]}`);
          }
};