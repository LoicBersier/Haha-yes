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
                    default: ''
                },
                {
                    key: 'type',
                    prompt: 'How the face should change ? (default to female)',
                    type: 'string',
                    default: 'female',
                    oneOf: ["no-filter", "smile", "smile_2", "hot", "old", "young", "hollywood", "fun_glasses", "hitman", "mustache_free", "pan", "heisenberg", "female", "female_2", "male", "impression", "goatee", "mustache", "hipster", "lion", "bangs", "glasses", "wave", "makeup"]
                }
            ]
        });
    }

    async run(message, { url, type }) {

        let Attachment = (message.attachments).array();
        console.log(Attachment)
        if(!Attachment[0] && !url) {
            return message.say("You need to send an image")
        } else if(url.includes("http") || url.includes("www")) {
        let face = type.toLowerCase();
        let { body } = await superagent.get(url)
        let image = await faceapp.process(body, face)
        .catch(error => {
            message.say('Cant recognize the face')
            console.error(error)
        })
        message.channel.sendFile(image)
        } else {
        let face = type.toLowerCase();
        let { body } = await superagent.get(Attachment[0].url)
        let image = await faceapp.process(body, face)
        .catch(error => {
            message.say('Cant recognize the face')
            console.error(error)
        })
        message.channel.sendFile(image)
    }
}};