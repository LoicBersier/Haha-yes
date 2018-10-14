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

        const ctx = canvas.getContext('2d')
        const background = await loadImage(image);
        ctx.drawImage(background, 140, 30, 400, 400);
        const { body: buffer } = await superagent.get('https://image.noelshack.com/fichiers/2018/41/7/1539534719-untitled.png');
        const bg = await loadImage(buffer);
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

        // i keep this here in case i want to add text( i'il delete later if i dont need )

        //ctx.font = applyText(canvas, test)
        //ctx.font = '40px sans-serif';
    // Select the style that will be used to fill the text in
        //ctx.fillStyle = '#000000';
    // Actually fill the text with a solid color
        //ctx.fillText(test, canvas.width / 2.1, canvas.height / 1.5);

        const attachment = new Discord.Attachment(canvas.toBuffer(), 'test.png');

        message.say(attachment);

          }
};