const fs = require('fs');
const { Command } = require('discord-akairo');

class autoresponseCommand extends Command {
    constructor() {
        super('autoresponse', {
            aliases: ['autoresponse'],
            category: 'admin',
            args: [
                {
                    id: 'text',
                    type: 'string'
                },
                {
                    id: 'all',
                    type: 'string'
                }
            ],
            userPermissions: ['ADMINISTRATOR'],
            channelRestriction: 'guild',
            description: {
                content: 'enable/disable autoresponse',
                usage: '[enable/disable] (optional) [all]',
                examples: ['enable all']
            }
        });
    }

    async exec(message, args) {
        let text = args.text;
        let all = args.all;

        let autoresponse = {};
        let json = JSON.stringify(autoresponse);

        if (all == 'all') {
            const guild = this.client.guilds.get(message.guild.id);

            fs.readFile('./json/autoresponse.json', 'utf8', function readFileCallback(err, data) {
                if (err) {
                    fs.close();
                    console.log(err);
                } else {

                    autoresponse = JSON.parse(data); //now it an object
                    guild.channels.forEach(channel => autoresponse[channel] = text);
                    json = JSON.stringify(autoresponse); //convert it back to json
                    json = json.replace(/[<#>]/g, '');
                    fs.writeFile('./json/autoresponse.json', json, 'utf8', function (err) {
                        if (err) {
                            fs.close();
                            return console.log(err);
                        }
                    })
                }
            });

            fs.close();
            return message.channel.send('Auto response have been disable/enable on every channel');

        } else if (text == 'disable' || 'enable') {
            fs.readFile('./json/autoresponse.json', 'utf8', function readFileCallback(err, data) {
                if (err) {
                    console.log(err);
                } else {
                    autoresponse = JSON.parse(data); //now it an object
                    autoresponse[message.channel.id] = text;
                    json = JSON.stringify(autoresponse); //convert it back to json
                    fs.writeFile('./json/autoresponse.json', json, 'utf8', function (err) {
                        if (err) {
                            fs.close();
                            return console.log(err);
                        }
                    })
                }
            })
        };

        fs.close();
        return message.channel.send(`Autoresponse have been ${text}d`);
    }
}
module.exports = autoresponseCommand;