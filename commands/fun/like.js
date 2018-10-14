const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const { createCanvas, loadImage, getContext } = require('canvas')
const superagent = require('superagent')


module.exports = class idubbbzCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'test',
            group: 'fun',
            memberName: 'test',
            description: `Put the text you send in idubbbz piece of paper`,
        });
    }

    async run(message) {
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
        const { body: buffer } = await superagent.get('https://image.noelshack.com/fichiers/2018/41/7/1539547403-untitled.png');
        const bg = await loadImage(buffer);
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    
        const attachment = new Discord.Attachment(canvas.toBuffer(), 'edupspaint.png');

        message.say(attachment);

          }
};