const { Command } = require('discord.js-commando');
const faceapp = require('faceapp')
const superagent = require('superagent')
const SelfReloadJSON = require('self-reload-json');
const blacklist = require('../../blacklist');

module.exports = class faceappCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'face',
            group: 'images',
            memberName: 'face',
            description: `use faceapp to change the face of someone, Here the available filter <https://goo.gl/5LLbJJ>`,
            args: [
                {
                    key: 'type',
                    prompt: 'How the face should change ? (default to female)',
                    type: 'string',
                    default: 'female',
                    oneOf: ["no-filter", "smile", "smile_2", "hot", "old", "young", "hollywood", "fun_glasses", "hitman", "mustache_free", "pan", "heisenberg", "female", "female_2", "male", "impression", "goatee", "mustache", "hipster", "lion", "bangs", "glasses", "wave", "makeup"]
                },
                {
                    key: 'url',
                    prompt: 'Wich image would you want to process (default to empty so you can also send an image without the adress)',
                    type: 'string',
                    default: ''
                }
            ]
        });
    }

    async run(message, { url, type }) {
        let blacklistJson = new SelfReloadJSON('json/blacklist.json');
        if(blacklistJson[message.author.id])
        return blacklist(blacklistJson[message.author.id] , message)

        let Attachment = (message.attachments).array();
        let origin = null;
        if(!Attachment[0] && !url) {
            return message.say("You need to send an image")
        } else if(url.includes("http") || url.includes("www")) {
            origin = url;
    } else 
        origin = Attachment[0].url

        let face = type.toLowerCase();
        let { body } = await superagent.get(origin)
        try {
        let image = await faceapp.process(body, face)
        return message.channel.send({files: [image]});
        }
        catch (error) {
            message.say('Cant recognize the face');
            return console.error(error);
        }
}};