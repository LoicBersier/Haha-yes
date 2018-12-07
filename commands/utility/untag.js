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
            userPermissions: ['MANAGE_MESSAGES'],
            args: [
                {
                    key: 'trigger',
                    prompt: 'What is the word to remove',
                    type: 'string',
                }
            ]
        });
    }

    async run(message, { trigger }) {
        if(blacklist[message.author.id])
        return message.channel.send("You are blacklisted")

            trigger = trigger.toLowerCase();
            
            let customresponse = {}
            let json = JSON.stringify(customresponse)

            
            fs.readFile(`./tag/${message.guild.id}.json`, 'utf8', function readFileCallback(err, data){
                if (err){
                    console.log(err);
                } else {
                customresponse = JSON.parse(data); //now it an object
                delete customresponse[trigger]
                json = JSON.stringify(customresponse); //convert it back to json
                fs.writeFile(`./tag/${message.guild.id}.json`, json, 'utf8', function(err) {
                    if(err) {
                        return console.log(err);
                    } 
            })}});
            
            return message.say(`The following autoresponse have been deleted: ${trigger}`);
        }
};