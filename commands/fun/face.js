const { Command } = require('discord.js-commando');
const faceapp = require('faceapp')
const superagent = require('superagent')
module.exports = class faceappCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'face',
            group: 'fun',
            memberName: 'face',
            description: `use faceapp to change the face of someone, Here the available filter https://goo.gl/5LLbJJ`,
            args: [
                {
                    key: 'url',
                    prompt: 'Wich image would you want to process',
                    type: 'string',
                },
                {
                    key: 'type',
                    prompt: 'How the face should change ?',
                    type: 'string',
                }
            ]
        });
    }

    async run(message, { url, type }) {
        if(url.includes("http") || url.includes("www")) {
        let face = type.toLowerCase();
        let { body } = await superagent.get(url)
        let image = await faceapp.process(body, face)
        message.channel.sendFile(image)
    } else 
    message.say("You need to input a link")
          }
};