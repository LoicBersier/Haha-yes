const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { createCanvas, loadImage, getContext } = require('canvas');
const superagent = require('superagent');

class IdubbbzCommand extends Command {
    constructor() {
        super('idubbbz', {
            aliases: ['idubbbz', 'edups'],
            category: 'images',
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


            const canvas = createCanvas(1281, 627)
            const applyText = (canvas, text) => {
                const ctx = canvas.getContext('2d');
            
                // Declare a base size of the font
                let fontSize = 50;
            
                do {
                    // Assign the font to the context and decrement it so it can be measured again
                    ctx.font = `${fontSize -= 10}px ubuntu`;
                } while (ctx.measureText(text).width > 700 - 300);
            
                // Return the result to use in the actual canvas
                return ctx.font;
            };

        const ctx = canvas.getContext('2d')
        const background = await loadImage(image);
        ctx.drawImage(background, 620, 100, 200, 200);
        const { body: buffer } = await superagent.get('https://image.noelshack.com/fichiers/2018/41/7/1539510207-untitled.png').catch(error => {
            return message.channel.send('An error as occured, please try again')
        })
        const bg = await loadImage(buffer);
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
        ctx.font = applyText(canvas, text)
        ctx.fillStyle = '#000000';
        ctx.fillText(text, canvas.width / 2.1, canvas.height / 1.5);

        const attachment = new Discord.Attachment(canvas.toBuffer(), 'edups.png');

        message.channel.send(attachment).catch(error => {
            message.channel.send('an error as occured. Check the bot/channel permissions')
        })
    }
}

module.exports = IdubbbzCommand;