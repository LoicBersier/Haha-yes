const { Command } = require('discord.js-commando');
const blacklist = require('../../json/blacklist.json');
const Discord = require('discord.js');
const SelfReloadJSON = require('self-reload-json');
const fs = require('fs');
module.exports = class taglistCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'taglist',
            group: 'utility',
            memberName: 'taglist',
            description: `List all the tag`
        });
    }

    async run(message) {
        if(blacklist[message.author.id])
        return message.channel.send("You are blacklisted")

        try {
            let customresponse = new SelfReloadJSON(`./tag/${message.guild.id}.json`);
            let count = Object.keys(customresponse).length
            
    
                fs.readFile(`./tag/${message.guild.id}.json`, 'utf8', function readFileCallback(err, data){
                    if (err) {
                        console.log(err);
                    }
                    let json = JSON.stringify(data)
                    json = json.replace(/[{}"\\]+/g, '')
                    json = json.replace(/,+/g, '\n')
                    const tagEmbed = new Discord.RichEmbed()
                    .setColor("#ff9900")
                    .setTitle('Tags list')
                    .setDescription(`Trigger:Response\n\n${json}`)
                    .setFooter(`You have ${count} tags on this server`)
            
                    message.say(tagEmbed);
                });
        } catch {
            message.say('An error has occured, do you have any tags on the server?')
        }

  

        }

};