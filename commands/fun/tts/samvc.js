const { Command } = require('discord-akairo');
const axios = require('axios');
const fs = require('fs');

class samvcCommand extends Command {
	constructor() {
		super('samvc', {
			aliases: ['samvc'],
			category: 'fun',
			args: [
				{
					id: 'samMessage',
					type: 'string',
					match: 'rest'
				}
			],
			description: {
				content: 'Repeat what you said in voice chat with Microsoft Sam tts',
				usage: '[text]',
				examples: ['Here comes the roflcopter soisoisoisoisoi']
			}
		});
	}

	async exec(message, args) {
		args.samMessage = args.samMessage.replace('\n', ' ');
		args.samMessage = encodeURI(args.samMessage);

		return axios.request({
			responseType: 'arraybuffer',
			url: `https://tetyys.com/SAPI4/SAPI4?text=${args.samMessage}&voice=Sam&pitch=100&speed=100`,
			method: 'get',
			headers: {
				'Content-Type': 'audio/mpeg',
			},
		}).then(async (result) => {
			const outputFilename = './samvc.mp3';
			fs.writeFileSync(outputFilename, result.data);

			const voiceChannel = message.member.voice.channel;
			if (!voiceChannel) return message.say('Please enter a voice channel first.');
			try {
				const connection = await voiceChannel.join();
				const dispatcher = connection.play('./samvc.wav');
				dispatcher.once('finish', () => voiceChannel.leave());
				dispatcher.once('error', () => voiceChannel.leave());
				return null;
			} catch (err) {
				voiceChannel.leave();
				return message.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
			}
		});

	}
}

module.exports = samvcCommand;