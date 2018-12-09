const { Command } = require('discord.js-commando');
const textToSpeech = require('@google-cloud/text-to-speech');
const gclient = new textToSpeech.TextToSpeechClient();
const SelfReloadJSON = require('self-reload-json');
const fs = require('fs');


module.exports = class ttsvcCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ttsvc',
            group: 'fun',
            memberName: 'ttsvc',
            description: `Play what you write in tts in vc`,
            args: [
                {
                    key: 'text',
                    prompt: 'What do you want to be said',
                    type: 'string',
                }
            ]
        });
    }

    async run(message, { text }) {
        let blacklistJson = new SelfReloadJSON('./json/blacklist.json');
        if(blacklistJson[message.author.id])
        return blacklist(blacklistJson[message.author.id] , message)

          // Construct the request
          const request = {
            input: {text: text},
            // Select the language and SSML Voice Gender (optional)
            voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
            // Select the type of audio encoding
            audioConfig: {audioEncoding: 'MP3'},
          };

          // Performs the Text-to-Speech request
          gclient.synthesizeSpeech(request, (err, response) => {
            if (err) {
              console.error('ERROR:', err);
              return;
            }

            // Write the binary audio content to a local file
            fs.writeFile('ttsvc.mp3', response.audioContent, 'binary', err => {
              if (err) {
                console.error('ERROR:', err);
                message.say('An error has occured, the message is probably too long')
                return;
              }
              console.log('Audio content written to file: ttsvc.mp3');
              const { voiceChannel } = message.member;

              //  If not in voice channel ask user to join
                          if (!voiceChannel) {
                              return message.reply('please join a voice channel first!');
                              
                          } else 
              //  If user say "stop" make the bot leave voice channel
                          if (text == 'stop') {
                              voiceChannel.leave()
                              message.say('I leaved the channel');
                          } else
                          voiceChannel.join().then(connection => {
                              const dispatcher = connection.playStream('./ttsvc.mp3');
              //  End at then end of the audio stream
                                dispatcher.on('finish', () => setTimeout(function(){
                                    voiceChannel.leave();
                                }, 2000));
                          });
            });
          });
}}