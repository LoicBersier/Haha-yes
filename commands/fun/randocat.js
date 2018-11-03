const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const fetch = require('node-fetch')
const blacklist = require('../../json/blacklist.json')

module.exports = class RandoDogCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'randocat',
            group: 'fun',
            memberName: 'randocat',
            description: `Show a random cat`,
        });
    }

    async run(message) {
        if(blacklist[message.author.id])
        return message.channel.send("You are blacklisted")

        fetch("http://aws.random.cat/meow").then((response) => {
  return response.json();
}).then((response) => {
        const catEmbed = new Discord.RichEmbed()
        .setColor("#ff9900")
        .setTitle('Meow')
        .setImage(response.file)


            message.say(catEmbed);
          });
}};