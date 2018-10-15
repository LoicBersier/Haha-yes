const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const { createCanvas, loadImage, getContext } = require('canvas')
const superagent = require('superagent')


module.exports = class uglyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ugly',
            group: 'images',
            memberName: 'ugly',
            description: `You are very ugly!`,
        });
    }

    async run(message) {
        let Attachment = (message.attachments).array();
        let image = null
        if (!Attachment[0])
            image = message.author.displayAvatarURL
        else 
            image = Attachment[0].url

        const canvas = createCanvas(323, 400)
        const ctx = canvas.getContext('2d')
        const background = await loadImage('https://image.noelshack.com/fichiers/2018/42/1/1539598678-untitled.png');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        const { body: buffer } = await superagent.get(image);
        const bg = await loadImage(buffer);
        ctx.drawImage(bg, 40, 100, 250, 250);
    
        const attachment = new Discord.Attachment(canvas.toBuffer(), 'edupspaint.png');

        message.say(attachment).catch(error => {
            message.say('an error as occured. Check the bot/channel permissions')
        })

          }
};