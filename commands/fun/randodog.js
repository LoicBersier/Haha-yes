const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const fetch = require('node-fetch')
const blacklist = require('../../json/blacklist.json')

module.exports = class RandoCatCommand extends Command {
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

        fetch("https://random.dog/woof.json").then((response) => {
  return response.json();
}).then((response) => {
        const dogEmbed = new Discord.RichEmbed()
        .setColor("#ff9900")
        .setTitle('Meow')
        .setImage(response.file)


            message.say(dogEmbed);
          });
}};