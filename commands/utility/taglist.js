const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const SelfReloadJSON = require('self-reload-json');
const fs = require('fs');

class taglistCommand extends Command {
    constructor() {
        super('taglist', {
            aliases: ['taglist'],
            category: 'utility',
            channelRestriction: 'guild',
            description: {
                content: 'Show the list of tag for this server.',
                usage: '',
                examples: ['']
            }
        });
    }

    async exec(message) {
        try {
            let customresponse = new SelfReloadJSON(`./tag/${message.guild.id}.json`);
            let count = Object.keys(customresponse).length


            await fs.readFile(`./tag/${message.guild.id}.json`, 'utf8', function readFileCallback(err, data) {
                if (err) {
                    console.log(err);
                    /* do you need it to end here on error? if so uncomment the following code:
                    fs.close();
                    return;
                    */
                }
                let json = JSON.stringify(data)
                json = json.replace(/[{}"\\]+/g, '')
                json = json.replace(/,+/g, '\n')
                const tagEmbed = new Discord.RichEmbed()
                    .setColor("#ff9900")
                    .setTitle('Tags list')
                    .setDescription(`Trigger:Response\n\n${json}`)
                    .setFooter(`You have ${count} tags on this server`)

                message.channel.send(tagEmbed);
            });
            fs.close();
        } catch {
            fs.close();
            message.channel.send('An error has occured, do you have any tags on the server?');
        }
    }
}

module.exports = taglistCommand;