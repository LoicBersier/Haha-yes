const { Command } = require('discord.js-commando');
const blacklist = require('../../json/blacklist.json');
const fs = require('fs');
module.exports = class AutoresponseCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'autoresponse',
            group: 'admin',
            memberName: 'autoresponse',
            userPermissions: ['MANAGE_MESSAGES'],
            description: `Can disable autoresponse in the channel`,
            args: [
                {
                    key: 'text',
                    prompt: 'Disable or enable?',
                    type: 'string',
                    oneOf: ['disable', 'enable'],
                }
            ]
        });
    }

    async run(message, { text }) {
        if(blacklist[message.author.id])
        return message.channel.send("You are blacklisted")

            let autoresponse = {}
            let json = JSON.stringify(autoresponse)

            fs.readFile('json/autoresponse.json', 'utf8', function readFileCallback(err, data){
                if (err){
                    console.log(err);
                } else {
                autoresponse = JSON.parse(data); //now it an object
                autoresponse [message.channel.id] = text
                json = JSON.stringify(autoresponse); //convert it back to json
                fs.writeFile('json/autoresponse.json', json, 'utf8', function(err) {
                    if(err) {
                        return console.log(err);
                    } 
            })}});
            
            message.say(`Autoresponse have been ${text}d`);
          }
};