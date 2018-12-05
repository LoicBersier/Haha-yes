const { Command } = require('discord.js-commando');
const blacklist = require('../../json/blacklist.json');
const fs = require('fs');
module.exports = class CustomResponseCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'customresponse',
            group: 'admin',
            memberName: 'customresponse',
            userPermissions: ['ADMINISTRATOR'],
            description: `Can disable autoresponse in the channel (you can add "ALL" like this "haha enable/disable all" to enable/disable in every channel (EXPERIMENTAL))`,
            args: [
                {
                    key: 'trigger',
                    prompt: 'Disable or enable?',
                    type: 'string',
                },
                {
                    key: 'response',
                    prompt: 'Disable or enable?',
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
            trigger = trigger.replace('--', ' ')
            let customresponse = {}
            let json = JSON.stringify(customresponse)

            fs.readFile('DiscordBot/json/customresponse.json', 'utf8', function readFileCallback(err, data){
                if (err){
                    console.log(err);
                } else {
                customresponse = JSON.parse(data); //now it an object
                customresponse [message.guild.id] = { 'text': trigger, 'response': response } 
                json = JSON.stringify(customresponse); //convert it back to json
                fs.writeFile('DiscordBot/json/customresponse.json', json, 'utf8', function(err) {
                    if(err) {
                        return console.log(err);
                    } 
            })}});
            
            return message.say(`autoresponse have been set`);
        }
};