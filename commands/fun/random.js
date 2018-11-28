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
//      Generate a random number for each files
        let verbRand = Math.floor((Math.random() * verb.length) + 1);
        let nounRand = Math.floor((Math.random() * noun.length) + 1);
        let adverbRand = Math.floor((Math.random() * adverb.length) + 1);
        let adjectiveRand = Math.floor((Math.random() * adjective.length) + 1);
//      Replace with a random word from the json
        text = text.replace('[verb]', verb[verbRand])
        text = text.replace('[adverb]', adverb[adverbRand])
        text = text.replace('[noun]', noun[nounRand])
        text = text.replace('[adjective]', adjective[adjectiveRand])
//      Send the final text
        message.say(text);
          }
};