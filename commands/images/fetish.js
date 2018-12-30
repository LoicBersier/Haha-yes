const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { createCanvas, loadImage, getContext } = require('canvas');
const superagent = require('superagent');

class FetishCommand extends Command {
    constructor() {
        super('fetish', {
            aliases: ['fetish'],
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

        const canvas = createCanvas(528, 559)
        const ctx = canvas.getContext('2d')
        const background = await loadImage('https://image.noelshack.com/fichiers/2018/42/2/1539644291-my-fetish-5910119d988512.png').catch(error => {
            return message.channel.send('An error as occured, please try again')
        })
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        const { body: buffer } = await superagent.get(image);
        const bg = await loadImage(buffer);
        ctx.drawImage(bg, 50, 50, 450, 450);
    
        const attachment = new Discord.Attachment(canvas.toBuffer(), 'myfetish.png');


        message.channel.send(attachment).catch(() => {
            message.channel.send('an error as occured. Check the bot/channel permissions')
        })
    }
}

module.exports = FetishCommand;