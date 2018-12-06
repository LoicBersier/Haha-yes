const { Command } = require('discord.js-commando');
const blacklist = require('../../json/blacklist.json');
const fs = require('fs');
module.exports = class CustomResponseCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'tag',
            aliases: ['customresponse'],
            group: 'utility',
            memberName: 'tag',
            description: `Custom auto response`,
            args: [
                {
                    key: 'trigger',
                    prompt: 'The word that will trigger the autoresponse (use "--" instead of spaces)',
                    type: 'string',
                },
                {
                    key: 'response',
                    prompt: 'The response to the word ( you can use spaces here )',
                    type: 'string',
                }
            ]
        });
    }

    async run(message, { trigger, response }) {
        if(blacklist[message.author.id])
        return message.channel.send("You are blacklisted")

            trigger = trigger.toLowerCase();
            response = response.toLowerCase()
            do {
                trigger = trigger.replace('--', ' ')
            } while (trigger.includes('--'))
            
            let customresponse = {}
            let json = JSON.stringify(customresponse)

            
            fs.writeFile(`DiscordBot/tag/${message.guild.id}.json`, '{}', function (err) {
                if (err){
                    console.log(err);
                }
            })

            fs.readFile(`DiscordBot/tag/${message.guild.id}.json`, 'utf8', function readFileCallback(err, data){
                if (err){
                    console.log(err);
                } else {
                customresponse = JSON.parse(data); //now it an object
                customresponse [trigger] = response
                json = JSON.stringify(customresponse); //convert it back to json
                fs.writeFile(`DiscordBot/tag/${message.guild.id}.json`, json, 'utf8', function(err) {
                    if(err) {
                        return console.log(err);
                    } 
            })}});
            
            return message.say(`autoresponse have been set to ${trigger} : ${response}`);
        }
};