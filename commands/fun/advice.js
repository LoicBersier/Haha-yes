const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const fetch = require('node-fetch')
module.exports = class RandoCatCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'advice',
            group: 'fun',
            memberName: 'advice',
            description: `Show some random advice`,
        });
    }

    async run(message) {
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