const { Command } = require('discord.js-commando');
const SelfReloadJSON = require('self-reload-json');
const blacklist = require('../../json/blacklist.json');

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
        let blacklistJson = new SelfReloadJSON('./json/blacklist.json');
        if(blacklistJson[message.author.id])
        return blacklist(blacklistJson[message.author.id] , message)
        
            let clap = text.replace(/ /g, ' 👏 ');
            message.delete();
            message.say(`${clap} 👏`);
}};