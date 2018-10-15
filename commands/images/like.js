const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const { createCanvas, loadImage, getContext } = require('canvas')
const superagent = require('superagent')
const blacklist = require('../../json/blacklist.json')



module.exports = class likeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'like',
            group: 'images',
            memberName: 'like',
            description: `What the hell is this and why did my grandsone like it`,
        });
    }

    async run(message) {
        if(blacklist[message.author.id])
        return message.channel.send("You are blacklisted")
        let Attachment = (message.attachments).array();
        let image = null
        if (!Attachment[0])
            image = message.author.displayAvatarURL
        else 
            image = Attachment[0].url

        const canvas = createCanvas(386, 399)
        const ctx = canvas.getContext('2d')
        const background = await loadImage(image);
        ctx.drawImage(background, 40, 0, 300, 255);
        const { body: buffer } = await superagent.get('https://image.noelshack.com/fichiers/2018/41/7/1539547403-untitled.png').catch(error => {
            return message.say('An error as occured, please try again')
        })
        const bg = await loadImage(buffer);
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    
        const attachment = new Discord.Attachment(canvas.toBuffer(), 'edupspaint.png');

        message.say(attachment).catch(error => {
            message.say('an error as occured. Check the bot/channel permissions')
        })

          }
};