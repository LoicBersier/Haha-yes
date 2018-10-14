const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const { createCanvas, loadImage, getContext } = require('canvas')
const superagent = require('superagent')


module.exports = class godCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'god',
            group: 'images',
            memberName: 'god',
            description: `Retweet if you aren't afraid to have a picture of god on your timeline`,
        });
    }

    async run(message) {
        let Attachment = (message.attachments).array();
        let image = null
        if (!Attachment[0])
            image = message.author.displayAvatarURL
        else 
            image = Attachment[0].url

        const canvas = createCanvas(310, 400)
        const ctx = canvas.getContext('2d')
        const background = await loadImage(image);
        ctx.drawImage(background, 20, 80, 275, 250);
        const { body: buffer } = await superagent.get('https://image.noelshack.com/fichiers/2018/42/1/1539555260-untitled.png');
        const bg = await loadImage(buffer);
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    
        const attachment = new Discord.Attachment(canvas.toBuffer(), 'edupspaint.png');

        message.say(attachment);

          }
};