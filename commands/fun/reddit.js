const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const fetch = require('node-fetch');
const blacklist = require('../../json/blacklist.json')

module.exports = class redditCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'reddit',
            group: 'fun',
            memberName: 'reddit',
            description: `Show a random images from the subreddit you choose`,
            args: [
                {
                    key: 'sub',
                    prompt: 'Wich subreddit would you like to see?',
                    type: 'string',
                }
            ]
        });
    }

    async run(message, { sub }) {
        if(blacklist[message.author.id])
        return message.channel.send("You are blacklisted")
        let /* the bodies hit the */ i = Math.floor((Math.random() * 10) + 1);
        let a = 0
        fetch('https://www.reddit.com/r/' + sub + '.json?limit=100').then((response) => {
            return response.json();
        }).then((response) => { 
            if (!response.data)
                return message.say('Not a valid subreddit')
            while (response.data.children[i].data.post_hint !== 'image') {
                i = Math.floor((Math.random() * response.data.children.length));

                a++
                if (a == 5)
                    return message.say("Could not find any images")
            }
                if (response.data.children[i].data.over_18 == true)
                    return message.say("No nsfw ( if you want a nsfw version of this commands use the feedback commands \"haha feedback <your feedback>\")")
                const redditEmbed = new Discord.RichEmbed()
                .setColor("#ff9900")
                .setTitle(response.data.children[i].data.title)
                .setImage(response.data.children[i].data.url)
                .setURL('https://reddit.com' + response.data.children[i].data.permalink)
                .setFooter(`⬆ ${response.data.children[i].data.ups}     💬 ${response.data.children[i].data.num_comments}`)
                
                message.say(redditEmbed);
            }
        
)}}