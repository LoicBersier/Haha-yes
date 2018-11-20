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
            message.say('Downloading...').then(msg => {
                video.on('end', function() {
                msg.delete()
                })
              })
            let video = youtubedl(link, [`--username=${fbuser}`,`--password=${fbpasswd}`])
            video.pipe(fs.createWriteStream('video.mp4'))
            video.on('error', function error(err) {
                console.log('error 2:', err);
                message.say("An error has occured, i can't download from the link you provided.")
              });
            video.on('end', function() {
                message.delete();
                message.channel.send(`Downloaded by ${message.author.username}`, {files: ["./video.mp4"]})
                .catch(error => message.say('File too big'))
            })
        } else 
            message.say("You need to input a valid link")
    }

}