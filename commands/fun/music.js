const { Command } = require('discord.js-commando');
const ytdl = require('ytdl-core');
module.exports = class MusicCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'music',
            group: 'fun',
            memberName: 'music',
            description: 'Play youtube link in vocal',
            args: [
                {
                    key: 'ytblink',
                    prompt: 'Wich Youtube link would you like to play? (stop to make the bot leave the channel)',
                    type: 'string',
                }
            ]
        });
    }

    run(message, { ytblink }) {
        const { voiceChannel } = message.member;

        if (!voiceChannel) {
            return message.reply('please join a voice channel first!');
        }

        if (ytblink == 'stop') {
            voiceChannel.leave()
        } else 
        voiceChannel.join().then(connection => {
            const stream = ytdl(ytblink, { filter: 'audioonly' });
            const dispatcher = connection.playStream(stream);

            
            dispatcher.on('end', () => voiceChannel.leave());
        });
    }
};