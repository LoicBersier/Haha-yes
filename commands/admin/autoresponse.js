const { Command } = require('discord.js-commando');
const blacklist = require('../../json/blacklist.json');
const fs = require('fs');
module.exports = class sayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'autoresponse',
            group: 'admin',
            memberName: 'autoresponse',
            userPermissions: ['MANAGE_MESSAGES'],
            description: `Repeat the text you send`,
            args: [
                {
                    key: 'text',
                    prompt: 'What do you want me to say',
                    type: 'string',
                    oneOf: ['disable', 'enable'],
                }
            ]
        });
    }

    async run(message, { text }) {
        if(blacklist[message.author.id])
        return message.channel.send("You are blacklisted")

            let test = {}
            let json = JSON.stringify(test)

            fs.readFile('json/autoresponse.json', 'utf8', function readFileCallback(err, data){
                if (err){
                    console.log(err);
                } else {
                test = JSON.parse(data); //now it an object
                test [message.channel.id] = text
                json = JSON.stringify(test); //convert it back to json
                fs.writeFile('json/autoresponse.json', json, 'utf8', function(err) {
                    if(err) {
                        return console.log(err);
                    } 
            })}});
            
            message.say(text);
          }
};