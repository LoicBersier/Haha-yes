const { Command } = require('discord-akairo');
const textToSpeech = require('@google-cloud/text-to-speech');
const gclient = new textToSpeech.TextToSpeechClient();

class TtsCommand extends Command {
    constructor() {
        super('tts', {
            aliases: ['tts'],
            category: 'general',
            split: 'none',
            args: [
                {
                    id: 'text',
                    type: 'string'
                }
            ],
            description: {
                content: 'Send a mp3 of what you wrote in tts',
                usage: '[text]',
                examples: ['hello']
            }
        });
    }

    async exec(message, args) {
        
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
                fs.writeFile('tts.mp3', response.audioContent, 'binary', err => {
                  if (err) {
                    console.error('ERROR:', err);
                    message.channel.send('An error has occured, the message is probably too long')
                    return;
                  }
                  console.log('Audio content written to file: tts.mp3');
                  message.channel.send({files: ['./tts.mp3']})
                });
              });
    }
}
module.exports = TtsCommand;