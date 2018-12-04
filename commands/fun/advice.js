const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const fetch = require('node-fetch')
const SelfReloadJSON = require('self-reload-json');


module.exports = class AdviceCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'advice',
            group: 'fun',
            memberName: 'advice',
            description: `Show some random advice`,
        });
    }

    async run(message) {
        let blacklistJson = new SelfReloadJSON('./json/blacklist.json');
        if(blacklistJson[message.author.id])
        return blacklist(blacklistJson[message.author.id] , message)
        
        fetch("http://api.adviceslip.com/advice").then((response) => {
  return response.json();
}).then((response) => {
        const adviceEmbed = new Discord.RichEmbed()
        .setColor("#ff9900")
        .setTitle(response.slip.slip_id)
        .setDescription(response.slip.advice)


            message.say(adviceEmbed);
          });
}};