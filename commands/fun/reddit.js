const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const snekfetch = require('snekfetch');
module.exports = class RandoCatCommand extends Command {
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
        console.log(body.data.children[i].data.post_hint)
        while (body.data.children[i].data.post_hint !== 'image') {
            i = Math.floor((Math.random() * 10) + 1);
        }
            if (body.data.children[i].data.crosspost_parent_list == true) {
                return message.say('test')
            }else if (body.data.children[i].data.over_18 == true) {
                return message.say("No nsfw")
            } 
            const dogEmbed = new Discord.RichEmbed()
            .setColor("#ff9900")
            .setTitle(body.data.children[i].data.title)
            .setImage(body.data.children[i].data.preview.images[0].source.url)
            
            message.say(dogEmbed);
        }
    }