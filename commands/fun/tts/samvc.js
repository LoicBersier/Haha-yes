const { Command } = require('discord-akairo');
const axios = require('axios');
const fs = require('fs');
const rand = require('../../../rand.js');

class samvcCommand extends Command {
	constructor() {
		super('samvc', {
			aliases: ['samvc'],
			category: 'fun',
			clientPermissions: ['ATTACH_FILES', 'SPEAK'],
			args: [
				{
					id: 'samMessage',
					type: 'string',
					prompt: {
						start: 'Write something so i can say it back in sam',
					},
					match: 'rest'
				}
			],
			description: {
				content: 'Repeat what you said in voice chat with Microsoft Sam tts, can change speed and pitch with [speed:a number] and [pitch:a]',
				usage: '[text]',
				examples: ['Here comes the roflcopter soisoisoisoisoi']
			}
		});
	}

	async exec(message, args) {
		args.samMessage = rand.random(args.samMessage, message);
		let pitch = '';
		if (args.samMessage.includes('[pitch:')) {
			pitch = args.samMessage.split(/(\[pitch:.*?])/);
			for (let i = 0, l = pitch.length; i < l; i++) {
				if (pitch[i].includes('[pitch:')) {
					pitch = pitch[i].replace('[pitch:', '').slice(0, -1);
					args.samMessage = args.samMessage.replace(/(\[pitch:.*?])/g, '');
					i = pitch.length;
				}
			}
			if (pitch > 200)
				pitch = 200;
			else if (pitch < 50)
				pitch = 50;
		} else {
			pitch = 100;
		}

		let speed = '';
		if (args.samMessage.includes('[speed:')) {
			speed = args.samMessage.split(/(\[speed:.*?])/);
			for (let i = 0, l = speed.length; i < l; i++) {
				if (speed[i].includes('[speed:')) {
					speed = speed[i].replace('[speed:', '').slice(0, -1);
					args.samMessage = args.samMessage.replace(/(\[speed:.*?])/g, '');
					i = speed.length;
				}
			}
			if (speed > 450)
				speed = 450;
			else if (speed < 30)
				speed = 30;
		} else {
			speed = 150;
		}

		args.samMessage = args.samMessage.replace('\n', ' ');
		args.samMessage = encodeURI(args.samMessage);

		return axios.request({
			responseType: 'arraybuffer',
			url: `https://tetyys.com/SAPI4/SAPI4?text=${args.samMessage}&voice=Sam&pitch=${pitch}&speed=${speed}`,
			method: 'get',
			headers: {
				'Content-Type': 'audio/mpeg',
			},
		}).then(async (result) => {
			const outputFilename = './samvc.wav';

			fs.writeFile(outputFilename, result.data, async function(err) {
				if (err) console.error(err);
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
					return message.reply(`Oh no, an error occurred: \`${err.message}\`.`);
				}
			});
		});
	}
}

module.exports = samvcCommand;