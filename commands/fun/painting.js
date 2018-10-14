const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const { createCanvas, loadImage, getContext } = require('canvas')
const superagent = require('superagent')


module.exports = class idubbbzCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'painting',
            aliases: ['idubbzpaint', 'edupspaint'],
            group: 'fun',
            memberName: 'painting',
            description: `Put the text you send in idubbbz piece of paper`,
            args: [
                {
                    key: 'test',
                    prompt: 'What do you the paper to say?',
                    type: 'string',
                    default: 'Perfection'
                }
            ]
        });
    }

    async run(message, { test }) {
        let Attachment = (message.attachments).array();
        let image = null
        if (!Attachment[0])
            image = message.author.displayAvatarURL
        else 
            image = Attachment[0].url

            const canvas = createCanvas(1024, 544)
            const applyText = (canvas, text) => {
                const ctx = canvas.getContext('2d');
            
                // Declare a base size of the font
                let fontSize = 100;
            
                do {
                    // Assign the font to the context and decrement it so it can be measured again
                    ctx.font = `${fontSize -= 10}px sans-serif`;
                } while (ctx.measureText(text).width > 800 - 300);
            
                // Return the result to use in the actual canvas
                return ctx.font;
            };

        const ctx = canvas.getContext('2d')
        const background = await loadImage(image);
        ctx.drawImage(background, 140, 30, 400, 400);
        const { body: buffer } = await superagent.get('https://image.noelshack.com/fichiers/2018/41/7/1539533685-untitled.png');
        const bg = await loadImage(buffer);
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
        ctx.font = applyText(canvas, test)
        ctx.fillStyle = '#ffffff';
        ctx.fillText(test, canvas.width / 3, canvas.height / 1.1);

        const attachment = new Discord.Attachment(canvas.toBuffer(), 'edupspaint.png');

        message.say(attachment);

          }
};