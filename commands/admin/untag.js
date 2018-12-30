const { Command } = require('discord-akairo');
const fs = require('fs');

class UnTagCommand extends Command {
    constructor() {
        super('untag', {
            aliases: ['untag'],
            category: 'admin',
            split: 'none',
            args: [
                {
                    id: "trigger",
                    type: "string"
                }
            ],
            channelRestriction: 'guild',
            description: {
                content: 'Remove created custom autoresponse',
                usage: '[trigger]',
                examples: ['"do you know da wea"']
            }
        });
    }

    async exec(message, args) {
        let trigger = args.trigger;

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
        
        return message.channel.send(`The following autoresponse have been deleted: ${trigger}`);

    }
}

module.exports = UnTagCommand;