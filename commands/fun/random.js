const { Command } = require('discord.js-commando');
const SelfReloadJSON = require('self-reload-json');
const blacklist = require('../../blacklist');
module.exports = class RandomCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'random',
            aliases: ['rand'],
            group: 'fun',
            memberName: 'test',
            description: `replace what you send with random verb adjective ect ( exemple '{prefix} random i want you to [verb] with [noun]')`,
            args: [
                {
                    key: 'text',
                    prompt: 'What do you want me to replace?',
                    type: 'string',
                }
            ]
        });
    }

    async run(message, { text }) {
        let blacklistJson = new SelfReloadJSON('json/blacklist.json');
        if(blacklistJson[message.author.id])
        return blacklist(blacklistJson[message.author.id] , message)

        
//      Load all the different files
        const verb = require('../../dictionary/verbs.json')
        const noun = require('../../dictionary/nouns.json')
        const adverb = require('../../dictionary/adjectives.json')
        const adjective = require('../../dictionary/adverbs.json')
//      Generate a random number
        function randNumber(file) {
            let Rand = Math.floor((Math.random() * file.length) + 1);
            return Rand;
        }
//      Replace with a random word from the json
        do {
        text = text.replace(/\[verb\]/, verb[randNumber(verb)])
        text = text.replace(/\[adverb\]/, adverb[randNumber(adverb)])
        text = text.replace(/\[noun\]/, noun[randNumber(noun)])
        text = text.replace(/\[adjective\]/, adjective[randNumber(adjective)])
        text = text.replace(/\[member\]/, message.guild.members.random().user.username)
        } while( text.includes('[verb]') || text.includes('[adverb]') || text.includes('[noun]') || text.includes('[adjective]' || text.includes('[member]' || text-includes('[adjectives]'))) )

//      Send the final text
        message.say(text);
          }
};