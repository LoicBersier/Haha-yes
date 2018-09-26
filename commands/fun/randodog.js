const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const snekfetch = require('snekfetch');
module.exports = class RandoDogCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'randodog',
            group: 'fun',
            memberName: 'randodog',
            description: `Show a random doggy`,
        });
    }

    async run(message, { city }) {
        const { body } = await snekfetch.get(`https://random.dog/woof.json`);
        if (body.cod == '404') {
            return message.say(`No results found for **${city}**`);
        }
        const dogEmbed = new Discord.RichEmbed()
        .setColor("#ff9900")
        .setTitle('Woof')
        .setImage(body.url)


            message.say(dogEmbed);
          }
};