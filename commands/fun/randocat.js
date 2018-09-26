const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const snekfetch = require('snekfetch');
module.exports = class CatCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'cat',
            group: 'fun',
            memberName: 'cat',
            description: `Show a random cat`,
        });
    }

    async run(message, { city }) {
        const { body } = await snekfetch.get(`http://aws.random.cat/meow`);
        if (body.cod == '404') {
            return message.say(`No results found for **${city}**`);
        }
        const dogEmbed = new Discord.RichEmbed()
        .setColor("#ff9900")
        .setTitle('Meow')
        .setImage(body.file)


            message.say(dogEmbed);
          }
};