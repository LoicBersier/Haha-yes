const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const { createCanvas, loadImage, getContext } = require('canvas')
const superagent = require('superagent')


module.exports = class humanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'human',
            group: 'images',
            memberName: 'human',
            description: `HUMAN ?! YOU DARE CALL THAT THING HUMAN?!?!`,
        });
    }

    async run(message) {
        let Attachment = (message.attachments).array();
        let image = null
        if (!Attachment[0])
            image = message.author.displayAvatarURL
        else 
            image = Attachment[0].url

        const canvas = createCanvas(578, 400)
        const ctx = canvas.getContext('2d')
        const background = await loadImage('https://image.noelshack.com/fichiers/2018/42/1/1539594726-untitled.png');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        const { body: buffer } = await superagent.get(image);
        const bg = await loadImage(buffer);
        ctx.drawImage(bg, 420, 120, 150, 150);
    
        const attachment = new Discord.Attachment(canvas.toBuffer(), 'edupspaint.png');

        message.say(attachment).catch(error => {
            message.say('an error as occured. Check the bot/channel permissions')
        })

          }
};