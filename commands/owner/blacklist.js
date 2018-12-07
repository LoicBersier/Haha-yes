const { Command } = require('discord.js-commando');
const fs = require('fs');
module.exports = class BlacklistCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'blacklist',
            aliases: ['niggerlist'],
            group: 'owner',
            memberName: 'blacklist',
            description: `To blacklist a user from the bot`,
            ownerOnly: true,
            args: [
                {
                    key: 'user',
                    prompt: 'Who do you want to blacklist',
                    type: 'user',
                },
                {
                    key: 'reasons',
                    prompt: 'Who do you want to blacklist',
                    type: 'string',
                    default: 'Didin\'t provide any reasons'
                }
            ]
        });
    }

    async run(message, { user, reasons }) {
            let blacklist = {}
            let json = JSON.stringify(blacklist)

            if(user) {
            fs.readFile('json/blacklist.json', 'utf8', function readFileCallback(err, data){
                if (err){
                    console.log(err);
                } else {
                blacklist = JSON.parse(data); //now it an object
                blacklist [user] = reasons
                json = JSON.stringify(blacklist); //convert it back to json
                json = json.replace(/[<@!>]/g, '')
                fs.writeFile('json/blacklist.json', json, 'utf8', function(err) {
                    if(err) {
                        return console.log(err);
                    } 
            })}});
            
            return message.say(`User ${user} have been blacklisted`);
        }
          }
};