const { Command } = require('discord.js-commando');
const blacklist = require('../../json/blacklist.json')

module.exports = class clapCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'clap',
            group: 'fun',
            memberName: 'clap',
            description: `Repeat the text you send with clap`,
            args: [
                {
                    key: 'text',
                    prompt: 'What do you want me to say',
                    type: 'string',
                }
            ]
        });
    }

    async run(message, { text }) {
        if(blacklist[message.author.id])
        return message.channel.send("You are blacklisted")
            let clap = text.replace(/ /g, ' 👏 ');
            message.delete();
            message.say(`${clap} 👏`);
}};