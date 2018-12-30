const { Command } = require('discord-akairo');
const fs = require('fs');
const youtubedl = require('youtube-dl');
const { fbuser, fbpasswd } = require('../../config.json');

class DownloadCommand extends Command {
    constructor() {
        super('download', {
            aliases: ['download', 'dl'],
            category: 'utility',
            args: [
                {
                    id: "link",
                    type: "string",
                    default: "https://www.youtube.com/watch?v=6n3pFFPSlW4"
                }
            ],
            clientPermissions: ['ATTACH_FILES'],
            description: {
				content: 'Download videos from different website from the link you provided',
				usage: '[link]',
				examples: ['https://www.youtube.com/watch?v=6n3pFFPSlW4']
			}
        });
    }

    async exec(message,args) {
        let link = args.link;

        if(link.includes("http") || link.includes("www")) {
            message.channel.send('Downloading <a:loadingmin:527579785212329984>').then(msg => {
                video.on('end', function() {
                msg.delete()
                })
              })
            let video = youtubedl(link, [`--username=${fbuser}`,`--password=${fbpasswd}`])
            video.pipe(fs.createWriteStream('./video.mp4'))
            video.on('error', function error(err) {
                console.log('error 2:', err);
                message.channel.send("An error has occured, i can't download from the link you provided.")
              });
            video.on('end', function() {
                message.delete();
                message.channel.send(`Downloaded by ${message.author.username}`, {files: ["./video.mp4"]})
                .catch(() => message.channel.send('File too big'))
            })
        } else 
            message.channel.send("You need to input a valid link")
    }
}

module.exports = DownloadCommand;