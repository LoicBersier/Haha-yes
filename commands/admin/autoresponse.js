const { Command } = require('discord.js-commando');
const blacklist = require('../../json/blacklist.json');
const fs = require('fs');
module.exports = class AutoresponseCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'autoresponse',
            group: 'admin',
            memberName: 'autoresponse',
            userPermissions: ['ADMINISTRATOR'],
            description: `Can disable autoresponse in the channel (you can add "ALL" like this "haha enable/disable all" to enable/disable in every channel (EXPERIMENTAL))`,
            args: [
                {
                    key: 'text',
                    prompt: 'Disable or enable?',
                    type: 'string',
                    oneOf: ['disable', 'enable','disable all', 'enable all'],
                },
                {
                    key: 'all',
                    prompt: 'Disable or enable in every channel? (EXPERIMENTAL)',
                    type: 'string',
                    oneOf: ['all', ''],
                    default: ''
                }
            ]
        });
    }

    async run(message, { text, all }) {
        if(blacklist[message.author.id])
        return message.channel.send("You are blacklisted")

            let autoresponse = {}
            let json = JSON.stringify(autoresponse)

            if (all == 'all') {
                const guild = this.client.guilds.get(message.guild.id);
                fs.readFile('json/autoresponse.json', 'utf8', function readFileCallback(err, data){
                    if (err){
                        console.log(err);
                    } else {
                    autoresponse = JSON.parse(data); //now it an object
                    guild.channels.forEach(channel => autoresponse [channel] = text)
                    json = JSON.stringify(autoresponse); //convert it back to json
                    json = json.replace(/[<#>]/g, '')
                    fs.writeFile('json/autoresponse.json', json, 'utf8', function(err) {
                        if(err) {
                            return console.log(err);
                        } 
                })}});

            return message.say('Auto response have been disable/enable on every channel')
            } else if(text == 'disable' || 'enable') {
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
            
            return message.say(`Autoresponse have been ${text}d`);
        }
          }
};