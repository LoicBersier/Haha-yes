const { Command } = require('discord.js-commando');
const fetch = require('node-fetch')
const SelfReloadJSON = require('self-reload-json');
const blacklist = require('../../blacklist');
const { yandexAPI } = require('../../config.json')

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
                    key: 'text',
                    prompt: 'What do you want me to translate',
                    type: 'string',
                }
            ]
        });
    }

    async run(message, { text }) {
        let blacklistJson = new SelfReloadJSON('json/blacklist.json');
        if(blacklistJson[message.author.id])
        return blacklist(blacklistJson[message.author.id] , message)
        
        console.log(yandexAPI)

        fetch(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=${yandexAPI}&text=${text}&lang=en`,{
        }).then((response) => {
  return response.json();
}).then((response) => {
    if (response.code != '200')
        return message.say('An error has occured')

        message.say(`${response.text[0]}`)
          });
}};