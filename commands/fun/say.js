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
            description: `Repeat the text you send ( can also use [verb] [noun] [adverb] [adjective] [activitie] [celebreties] [countrie] [diseases] [elements] [hobbie] [music] [prefixe] [pronoun] [state] [title] [unit] [member] [number] to replace it with something else )`,
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
        const noun = require('../../dictionary/noun.json')
        const adverb = require('../../dictionary/adjectives.json')
        const adjective = require('../../dictionary/adverbs.json')
        const activities = require('../../dictionary/activities.json')
        const celebreties = require('../../dictionary/celebreties.json')
        const countries = require('../../dictionary/countries.json')
        const diseases = require('../../dictionary/diseases.json')
        const elements = require('../../dictionary/elements.json')
        const hobbies = require('../../dictionary/hobbies.json')
        const music = require('../../dictionary/music.json')
        const prefixes = require('../../dictionary/prefixes.json')
        const pronouns = require('../../dictionary/pronouns.json')
        const states = require('../../dictionary/states.json')
        const titles = require('../../dictionary/titles.json')
        const units = require('../../dictionary/units.json')

        

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
        text = text.replace(/\[activitie\]/, activities[randNumber(activities)])
        text = text.replace(/\[celebrities\]/, celebreties[randNumber(celebreties)])
        text = text.replace(/\[countrie\]/, countries[randNumber(countries)])
        text = text.replace(/\[diseases\]/, diseases[randNumber(diseases)])
        text = text.replace(/\[elements\]/, elements[randNumber(elements)])
        text = text.replace(/\[hobbie\]/, hobbies[randNumber(hobbies)])
        text = text.replace(/\[music\]/, music[randNumber(music)])
        text = text.replace(/\[prefixe\]/, prefixes[randNumber(prefixes)])
        text = text.replace(/\[pronoun\]/, pronouns[randNumber(pronouns)])
        text = text.replace(/\[state\]/, states[randNumber(states)])
        text = text.replace(/\[title\]/, titles[randNumber(titles)])
        text = text.replace(/\[unit\]/, units[randNumber(units)])
        text = text.replace(/\[member\]/, message.guild.members.random().user.username)
        text = text.replace(/\[number\]/, Math.floor((Math.random() * 9) + 1))
//      Verify if it replaced everything
        } while( text.includes('[verb]') || text.includes('[adverb]') || text.includes('[noun]') || text.includes('[adjective]') || text.includes('[member]') || text.includes('[number]') || text.includes('[activitie]') || text.includes('[celebrities]') || text.includes('[countrie]') || text.includes('[diseases]') || text.includes('[elements]') || text.includes('[hobbie]') || text.includes('[music]') || text.includes('[prefixe]') || text.includes('[pronoun]') || text.includes('[state]') || text.includes('[title]') || text.includes('[unit]'))

//      Send the final text
        message.say(text);
          }
};