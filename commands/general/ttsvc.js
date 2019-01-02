const { Command } = require('discord-akairo');
const textToSpeech = require('@google-cloud/text-to-speech');
const gclient = new textToSpeech.TextToSpeechClient();
const fs = require('fs');

class TtsvcCommand extends Command {
	constructor() {
		super('ttsvc', {
			aliases: ['ttsvc'],
			category: 'general',
			split: 'none',
			args: [
				{
					id: 'text',
					type: 'string'
				}
			],
			description: {
				content: 'Say what you wrote in voice channel',
				usage: '[text]',
				examples: ['hello']
			}
		});
	}

	async exec(message, args) {
		let text = args.text;

		const { voiceChannel } = message.member;


		// Construct the request
		const request = {
			input: { text: text },
			// Select the language and SSML Voice Gender (optional)
			voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
			// Select the type of audio encoding
			audioConfig: { audioEncoding: 'MP3' },
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
					message.channel.send('An error has occured, the message is probably too long');
					fs.close();
					return;
				}
				console.log('Audio content written to file: ttsvc.mp3');

				//  If not in voice channel ask user to join
				if (!voiceChannel) {
					return message.reply('please join a voice channel first!');

				} else { // you should be careful in what is included in your scopes, you didn't use the {}
					//  If user say "stop" make the bot leave voice channel
					if (text == 'stop') {
						voiceChannel.leave();
						message.channel.send('I leaved the channel');
					} else { // you should be careful in what is included in your scopes, you didn't use the {}
						voiceChannel.join().then(connection => {
							const dispatcher = connection.playStream('./ttsvc.mp3');
							//  End at then end of the audio stream
							dispatcher.on('end', () => setTimeout(function () {
								voiceChannel.leave();
							}, 2000));
						});
					}
				}
			});
		});
	}
}
module.exports = TtsvcCommand;