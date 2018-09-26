const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const snekfetch = require('snekfetch');
const { openweatherAPI } = require('./config.json');
module.exports = class WeatherCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'weather',
            group: 'fun',
            memberName: 'weather',
            description: `Choose the city you want to know the weather`,
            args: [
                {
                    key: 'city',
                    prompt: 'city',
                    type: 'string',
                }
            ]
        });
    }

    async run(message, { city }) {
        const { body } = await snekfetch.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${openweatherAPI}`);
        if (!body.main.temp) {
            return message.say(`No results found for **${city}**`);
        }
        const test = new Discord.RichEmbed()
        .setColor("#ff9900")
        .setTitle(body.name + ' current weather')
        .setDescription(body.main.temp + '°c')
        .addField('Temp min', body.main.temp_min + '°c')
        .addField('Temp max', body.main.temp_max + '°c')


            message.say(test);
          }
};