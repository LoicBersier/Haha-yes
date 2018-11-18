const { Command } = require('discord.js-commando');
const fs = require('fs');
const youtubedl = require('youtube-dl');
const blacklist = require('../../json/blacklist.json');
const { fbuser, fbpasswd } = require('../../config.json');

module.exports = class downloadCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'download',
            group: 'utility',
            memberName: 'download',
            description: `Download any video from the link you provided.`,
            args: [
                {
                    key: 'link',
                    prompt: 'Wich video would you like to download?',
                    type: 'string',
                    default: 'https://www.youtube.com/watch?v=6n3pFFPSlW4'
                }
            ]
        });
    }

    async run(message, { link }) {
        if(blacklist[message.author.id])
        return message.channel.send("You are blacklisted")
        if(link.includes("http") || link.includes("www")) {
            message.say('Downloading...')
            let video = youtubedl(link, [`--username=${fbuser}`,`--password=${fbpasswd}`])
            video.pipe(fs.createWriteStream('video.mp4'))
            video.on('end', function() {
            message.delete();
            message.delete();
            message.channel.send({files: ["./video.mp4"]})
            .catch(error => message.say('An error has occured, the file might be too big or i cant download the link you provided'))
            })
        } else 
            message.say("You need to input a valid link")
    }

}