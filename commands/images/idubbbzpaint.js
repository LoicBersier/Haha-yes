const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { createCanvas, loadImage, getContext } = require('canvas');
const superagent = require('superagent');

class IdubbbzPaintCommand extends Command {
    constructor() {
        super('idubbbzpaint', {
            aliases: ['idubbbzpaint', 'edupspaint'],
            category: 'images',
            args: [
                {
                    id: 'text',
                    type: 'string'
                },
                {
                    id: 'image',
                    type: 'string'
                }
            ]
        });
    }

    async exec(message, args) {
        let text = args.text;
        let Attachment = (message.attachments).array();
        let image = args.image;
        if (!Attachment[0] && !image)
            image = message.author.displayAvatarURL
        else if(Attachment[0] && Attachment[0].url.endsWith('gif'))
            return message.channel.send('Gif dosent work, sorry')
        else if (!image)
            image = Attachment[0].url

            message.channel.send('Processing <a:loadingmin:527579785212329984>')
            .then(loadingmsg => loadingmsg.delete(1000))
            
            const canvas = createCanvas(1024, 544)
            const applyText = (canvas, text) => {
                const ctx = canvas.getContext('2d');
            
                // Declare a base size of the font
                let fontSize = 100;
            
                do {
                    // Assign the font to the context and decrement it so it can be measured again
                    ctx.font = `${fontSize -= 10}px ubuntu`;
                } while (ctx.measureText(text).width > 800 - 300);
            
                // Return the result to use in the actual canvas
                return ctx.font;
            };

        const ctx = canvas.getContext('2d')
        const background = await loadImage(image);
        ctx.drawImage(background, 140, 40, 400, 340);
        const { body: buffer } = await superagent.get('https://image.noelshack.com/fichiers/2018/41/7/1539533685-untitled.png').catch(error => {
            return message.channel.send('An error as occured, please try again')
        })
        const bg = await loadImage(buffer);
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
        ctx.font = applyText(canvas, text)
        ctx.fillStyle = '#ffffff';
        ctx.fillText(text, canvas.width / 3, canvas.height / 1.1);

        const attachment = new Discord.Attachment(canvas.toBuffer(), 'edupspaint.png');

        message.channel.send(attachment).catch(error => {
            message.channel.send('an error as occured. Check the bot/channel permissions')
        })
    }
}

module.exports = IdubbbzPaintCommand;