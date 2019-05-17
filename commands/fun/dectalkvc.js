const { Command } = require('discord-akairo');
const axios = require('axios');
const fs = require('fs');

class dectalkvcCommand extends Command {
	constructor() {
		super('dectalkvc', {
			aliases: ['dectalkvc', 'decvc'],
			category: 'fun',
			args: [
				{
					id: 'decMessage',
					type: 'string',
					match: 'rest'
				}
			],
			description: {
				content: 'Generate your text into dectalk and says it in voice chat',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message, args) {
		args.decMessage = args.decMessage.replace('\n', ' ');
		args.decMessage = encodeURI(args.decMessage);

		return axios.request({
			responseType: 'arraybuffer',
			url: `https://talk.moustacheminer.com/api/gen.wav?dectalk=${args.decMessage}`,
			method: 'get',
			headers: {
				'Content-Type': 'audio/wav',
			},
		}).then(async (result) => {
			const outputFilename = './dectalkvc.wav';
			fs.writeFileSync(outputFilename, result.data);

			const voiceChannel = message.member.voice.channel;
			if (!voiceChannel) return message.say('Please enter a voice channel first.');
			try {
				const connection = await voiceChannel.join();
				const dispatcher = connection.play('./dectalkvc.wav');
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

module.exports = dectalkvcCommand;