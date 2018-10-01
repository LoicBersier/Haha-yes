const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const fetch = require('node-fetch')
module.exports = class InfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'info',
            group: 'fun',
            memberName: 'info',
            description: `Search DuckDuckGo for answer`,
            args: [
                {
                    key: 'search',
                    prompt: 'What do you want me to search',
                    type: 'string',
                }
            ]
        });
    }

    async run(message, { search }) {
        let searchURL = encodeURI(search)
        fetch("https://api.duckduckgo.com/?q=" + searchURL + "&format=json").then((response) => {
  return response.json();
}).then((response) => {
    if (response.unsafe == 1) 
        return message.say("No nsfw sorry...")
    const ddgEmbed = new Discord.RichEmbed()
    .setColor("#ff9900")
    .setTitle(response.Heading)
    .setURL(response.AbstractURL)
    .setDescription(response.Abstract)
    .addField("Topic", response.meta.topic)
    .setImage(response.Image)
    .setTimestamp()
    .setFooter("Provided to you by DuckDuckgo", "https://i.imgur.com/POGt26Z.png")
    
    message.say(ddgEmbed);
});
}};