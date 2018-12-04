const { Command } = require('discord.js-commando');
const fetch = require('node-fetch')
const SelfReloadJSON = require('self-reload-json');


module.exports = class BadMemeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'badmeme',
            group: 'fun',
            memberName: 'badmeme',
            description: `Take random images from imgur`,
        });
    }

    async run(message) {
        let blacklistJson = new SelfReloadJSON('DiscordBot/json/blacklist.json');
        if(blacklistJson[message.author.id])
        return blacklist(blacklistJson[message.author.id] , message)

        fetch("https://api.imgur.com/3/gallery/hot/day?showViral=true&mature=false&perPage=100&album_previews=true", {
            headers: { "Authorization": "Client-ID e4cb6948f80f295" },
        }).then((response) => {
  return response.json();
}).then((response) => {
    if (response.success == 'false')
        return message.say('An error has occured')

        const i = Math.floor((Math.random() * response.data.length));

        message.say(`**${response.data[i].title}**`)
        message.say(response.data[i].link); 
          });
}};