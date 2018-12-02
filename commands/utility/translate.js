const { Command } = require('discord.js-commando');
const fetch = require('node-fetch')
const SelfReloadJSON = require('self-reload-json');
const blacklist = require('../../blacklist');
const Discord = require('discord.js');
const { yandexAPI } = require('../../config.json');

module.exports = class translationCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'translation',
            aliases: ['trn', 'translate'],
            group: 'utility',
            memberName: 'translation',
            description: `Translate what you say in english`,
            args: [
                {
                    key: 'language',
                    prompt: 'In what language do you want me to translate to? ( You can get the list here https://tech.yandex.com/translate/doc/dg/concepts/api-overview-docpage/)',
                    type: 'string',
                    default: 'en',
                    oneOf: ["az","ml","sq","mt","am","mk","en","mi","ar","mr","hy","mhr","af","mn","eu","de","ba","ne","be","no","bn","pa","my","pap","bg","fa","bs","pl","cy","pt","hu","ro","vi","ru","ht","ceb","gl","sr","nl","si","mrj","sk","el","sl","ka","sw","gu","su","da","tg","he","th","yi","tl","id","ta","ga","tt","it","te","is","tr","es","udm","kk","uz","kn","uk","ca","ur","ky","fi","zh","fr","ko","hi","xh","hr","km","cs","lo","sv","la","gd","lv","et","lt","eo","lb","jv","mg","ja","ms"]
                },
                {
                    key: 'text',
                    prompt: 'What do you want me to translate',
                    type: 'string',
                }
            ]
        });
    }

    async run(message, { text, language }) {
        let blacklistJson = new SelfReloadJSON('json/blacklist.json');
        if(blacklistJson[message.author.id])
        return blacklist(blacklistJson[message.author.id] , message)
        
        let textURI = encodeURI(text)
        fetch(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=${yandexAPI}&text=${textURI}&lang=${language}&options=1`,{
        }).then((response) => {
  return response.json();
}).then((response) => {
    if (response.code != '200')
        return message.say('An error has occured')


        const translationEmbed = new Discord.RichEmbed()
    .setColor('#0099ff')
    .setTitle('Asked for the following translation:')
    .setAuthor(message.author.username)
    .setDescription(response.text[0])
    .addField('Original text', text)
    .addField('Translated from', response.detected.lang)
    .setTimestamp()
    .setFooter('Powered by Yandex.Translate ');

        message.say(translationEmbed)
          });
}};