const { Command } = require('discord.js-commando');
const speak = require('simple-tts');
const SelfReloadJSON = require('self-reload-json');


module.exports = class BadMemeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'tts',
            group: 'fun',
            memberName: 'tts',
            description: `Return what you type in a tts file`,
            ownerOnly: true,

            args: [
                {
                    key: 'text',
                    prompt: 'What do you want to be said',
                    type: 'string',
                }
            ]
        });
    }

    async run(message, { text }) {
        let blacklistJson = new SelfReloadJSON('./json/blacklist.json');
        if(blacklistJson[message.author.id])
        return blacklist(blacklistJson[message.author.id] , message)

        speak(text, {format:'mp3', filename:'./tts'})
	.catch(err => message.say('An error has occured, you probably used an invalid char.'))
	setTimeout(function(){
        message.say({files: ['./tts.mp3']})
	.catch(err => message.say('An error has occured, you probably used invalid char.'))
}, 2000)
}}
