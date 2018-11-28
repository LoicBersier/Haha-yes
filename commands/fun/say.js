const { Command } = require('discord.js-commando');
const SelfReloadJSON = require('self-reload-json');
const blacklist = require('../../blacklist');
module.exports = class sayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'say',
            aliases: ['repeat'],
            group: 'fun',
            memberName: 'say',
            description: `Repeat the text you send ( can also use [verb] [noun] [adverb] [adjective] [member] and [number] to get random thing )`,
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
        text = text.replace(/\[number\]/, Math.floor((Math.random() * 10) + 1))
        } while( text.includes('[verb]') || text.includes('[adverb]') || text.includes('[noun]') || text.includes('[adjective]') || text.includes('[member]' || text.includes('[number]')) )

//      Send the final text
        message.say(text);
          }
};