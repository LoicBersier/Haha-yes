const { Command } = require('discord.js-commando');
const blacklist = require('../../json/blacklist.json');
const fs = require('fs');
module.exports = class CustomResponseCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'untag',
            aliases: ['rmcustomresponse'],
            group: 'utility',
            memberName: 'untag',
            description: `remove custom autoresponse`,
            args: [
                {
                    key: 'trigger',
                    prompt: 'What is the word to remove',
                    type: 'string',
                }
            ]
        });
    }

    async run(message, { trigger, response }) {
        if(blacklist[message.author.id])
        return message.channel.send("You are blacklisted")

            trigger = trigger.toLowerCase();
            
            let customresponse = {}
            let json = JSON.stringify(customresponse)

            
            fs.readFile('DiscordBot/json/customresponse.json', 'utf8', function readFileCallback(err, data){
                if (err){
                    console.log(err);
                } else {
                customresponse = JSON.parse(data); //now it an object
                customresponse [trigger] = { 'response': '', 'server': message.guild.id }
                json = JSON.stringify(customresponse); //convert it back to json
                fs.writeFile('DiscordBot/json/customresponse.json', json, 'utf8', function(err) {
                    if(err) {
                        return console.log(err);
                    } 
            })}});
            
            return message.say(`The following autoresponse have been deleted: ${trigger}`);
        }
};