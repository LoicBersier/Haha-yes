const { Command } = require('discord.js-commando');
const SelfReloadJSON = require('self-reload-json');
const blacklist = require('../../blacklist');
module.exports = class UpDootCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'updoot',
            aliases: ['vote'],
            group: 'utility',
            memberName: 'updoot',
            description: 'Send link to updoot my bot :D.',
        });
    }

    async run(message) {
        let blacklistJson = new SelfReloadJSON('json/blacklist.json');
        if(blacklistJson[message.author.id])
        return blacklist(blacklistJson[message.author.id] , message)
        
        const upDoot = {
            color: 0x93C54B,
            title: 'Vote for my bot',
            url: 'https://discordbots.org/bot/377563711927484418/vote',
            description: 'You can vote for my bot if you think the bot is awesome!',
            timestamp: new Date(),
            footer: {
                text: 'Thanks for the updoots',
                icon_url: 'https://cdn.discordapp.com/avatars/377563711927484418/1335d202aa466dbeaa4ed2e4b616484a.png?size=2048',
            },
        };
        
        message.channel.send({ embed: upDoot });
    }
};