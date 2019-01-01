const { Command } = require('discord-akairo');
const fs = require('fs');

class StarBoardCommand extends Command {
    constructor() {
        super('starboard', {
            aliases: ['starboard'],
            category: 'admin',
            channelRestriction: 'guild',
            args: [
                {
                    id: 'delete',
                    type: 'string'
                }
            ],
            userPermissions: ['ADMINISTRATOR'],
            description: {
                content: 'Set starboard',
                usage: '[]',
                examples: ['']
            }
        });
    }

    async exec(message, args) {
        let starboardChannel = message.channel.id;

            fs.readFile(`./starboard/${message.guild.id}.json`, 'utf8', function readFileCallback(err, data){
                if (err){
                    fs.writeFile(`./starboard/${message.guild.id}.json`, `{"starboard": "${starboardChannel}"}`, function (err) {
                        if (err){
                            console.log(err);
                        }
                        return message.channel.send(`This channel have been set as the starboard`);
                    })
                } else {
                    if (args.delete == 'delete') {
                        let starboard = JSON.parse(data); //now it an object
                        starboard ['starboard'] = '';
                        var json = JSON.stringify(starboard); //convert it back to json
                        var deleteBoard = true;
                    } else {
                        let starboard = JSON.parse(data); //now it an object
                        starboard ['starboard'] = starboardChannel;
                        var json = JSON.stringify(starboard); //convert it back to json
                    }
                fs.writeFile(`./starboard/${message.guild.id}.json`, json, 'utf8', function(err) {
                    if(err) {
                        return console.log(err);
                    } 
            })}});
            if (deleteBoard)
                return message.channel.send('The starboard have been deleted')
            else
                return message.channel.send(`This channel have been set as the starboard`);
    }
}

module.exports = StarBoardCommand;