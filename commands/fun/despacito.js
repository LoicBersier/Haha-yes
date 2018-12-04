const { Command } = require('discord.js-commando');
const responseObject = require("../../json/despacito.json");
const { createCanvas, loadImage, getContext } = require('canvas')
const superagent = require('superagent')
const Discord = require('discord.js');
const SelfReloadJSON = require('self-reload-json');
const blacklist = require('../../blacklist');
module.exports = class DespacitoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'despacito',
            group: 'fun',
            memberName: 'despacito',
            description: `despacito`,
            args: [
                {
                    key: 'user',
                    prompt: 'What do you want me to say',
                    type: 'user',
                    default: ''
                }
            ]
        });
    }

    async run(message, { user }) {
        let blacklistJson = new SelfReloadJSON('./json/blacklist.json');
        if(blacklistJson[message.author.id])
        return blacklist(blacklistJson[message.author.id] , message)
        
        if (!user) {
        const number = Object.keys(responseObject).length;
        const despacitoNumber = Math.floor (Math.random() * (number - 1 + 1)) + 1;
        return message.channel.send({files: [responseObject[despacitoNumber]]}).catch(error => {
            message.say('an error as occured')
        })

        } else if (user.id === this.client.user.id) {
            return message.say('Nice try but you wont get me :^)');
        } else {
            const canvas = createCanvas(660, 660);
            const ctx = canvas.getContext('2d');
            const background = await loadImage(user.avatarURL);
            ctx.drawImage(background, 5, 12, canvas.width, canvas.height);
            const { body: buffer } = await superagent.get('https://image.noelshack.com/fichiers/2018/41/6/1539381851-untitled.png');
            const bg = await loadImage(buffer);
            ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
            const attachment = new Discord.Attachment(canvas.toBuffer(), 'despacito.png');
            
        message.delete();
        message.say(`${user.username}, you have been despacito'd`, attachment).catch(error => {
            message.say('an error as occured')
        })
    }

        
} 
};