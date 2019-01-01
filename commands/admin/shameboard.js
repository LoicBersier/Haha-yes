const { Command } = require('discord-akairo');
const fs = require('fs');

class shamoeboardCommand extends Command {
    constructor() {
        super('shamoeboard', {
            aliases: ['shamoeboard'],
            category: 'admin',
            channelRestriction: 'guild',
            userPermissions: ['ADMINISTRATOR'],
            description: {
                content: 'Set shamoeboard',
                usage: '[]',
                examples: ['']
            }
        });
    }

    async exec(message) {
        let shamoeboardChannel = message.channel.id;

            fs.readFile(`./shamoeboard/${message.guild.id}.json`, 'utf8', function readFileCallback(err, data){
                if (err){
                    fs.writeFile(`./shamoeboard/${message.guild.id}.json`, `{"shamoeboard": "${shamoeboardChannel}"}`, function (err) {
                        if (err){
                            console.log(err);
                        }
                        return message.channel.send(`This channel have been set as the shamoeboard`);
                    })
                } else {
                    let shamoeboard = JSON.parse(data); //now it an object
                    shamoeboard ['shamoeboard'] = shamoeboardChannel;
                    var json = JSON.stringify(shamoeboard); //convert it back to json
                    fs.writeFile(`./shamoeboard/${message.guild.id}.json`, json, 'utf8', function(err) {
                        if(err) {
                            return console.log(err);
                        } 
            })}});
                return message.channel.send(`This channel have been set as the shamoeboard`);
    }
}

module.exports = shamoeboardCommand;