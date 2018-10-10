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
                }
            ]
        });
    }

    async run(message, { url }) {
        let { body } = await superagent.get(url)
        let image = await faceapp.process(body, 'hot')
        message.channel.sendFile(image)
          }
};