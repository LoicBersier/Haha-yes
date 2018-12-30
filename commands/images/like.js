const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { createCanvas, loadImage, getContext } = require('canvas');
const superagent = require('superagent');

class LikeCommand extends Command {
    constructor() {
        super('like', {
            aliases: ['like'],
            category: 'images',
            args: [
                {
                    id: 'image',
                    type: 'string'
                }
            ]
        });
    }

    async exec(message, args) {
        let Attachment = (message.attachments).array();
        let image = args.image;
        if (!Attachment[0] && !image)
            image = message.author.displayAvatarURL
        else if(Attachment[0] && Attachment[0].url.endsWith('gif'))
            return message.channel.send('Gif dosent work, sorry')
        else if (!image)
            image = Attachment[0].url

        const canvas = createCanvas(386, 399)
        const ctx = canvas.getContext('2d')
        const background = await loadImage(image);
        ctx.drawImage(background, 40, 0, 300, 255);
        const { body: buffer } = await superagent.get('https://image.noelshack.com/fichiers/2018/41/7/1539547403-untitled.png').catch(error => {
            return message.channel.send('An error as occured, please try again')
        })
        const bg = await loadImage(buffer);
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    
        const attachment = new Discord.Attachment(canvas.toBuffer(), 'like.png');

        message.channel.send(attachment).catch(error => {
            message.channel.send('an error as occured. Check the bot/channel permissions')
        })
    }
}

module.exports = LikeCommand;