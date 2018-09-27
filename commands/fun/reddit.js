const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const snekfetch = require('snekfetch');
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
                    default: 'random',
                }
            ]
        });
    }

    async run(message, { sub }) {
        const { body } = await snekfetch.get('https://www.reddit.com/r/' + sub + '.json');
        let /* the bodies hit the floor */ i = Math.floor((Math.random() * 10) + 1);
        if (!body.data.children[1]) {
            return message.say('Not a valid subreddit')
        }
        while (body.data.children[i].data.post_hint !== 'image') {
            i = Math.floor((Math.random() * 20) + 1);
        }
            if (body.data.children[i].data.over_18 == true) {
                return message.say("No nsfw ( if you want a nsfw version of this commands use the feedback commands \"haha feedback <your feedback>\")")
            } 
            const redditEmbed = new Discord.RichEmbed()
            .setColor("#ff9900")
            .setTitle(body.data.children[i].data.title)
            .setImage(body.data.children[i].data.preview.images[0].source.url)
            .setFooter(`⬆ ${body.data.children[i].data.ups} 💬 ${body.data.children[i].data.num_comments}`)
            
            message.say(redditEmbed);
        }
    }