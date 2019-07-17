const { Command } = require('discord-akairo');
const axios = require('axios');
const fs = require('fs');
const rand = require('../../../rand.js');

class dectalkvcCommand extends Command {
	constructor() {
		super('dectalkvc', {
			aliases: ['dectalkvc', 'decvc'],
			category: 'fun',
			args: [
				{
					id: 'decMessage',
					type: 'string',
					prompt: {
						start: 'Write something so i can say it back in dectalk',
					},
					match: 'rest'
				}
			],
			description: {
				content: 'Repeat what you sent in the voice chat you are currently in',
				usage: '[text]',
				examples: ['This command is very epic']
			}
		});
	}

	async exec(message, args) {
		args.decMessage = rand.random(args.decMessage, message);
		args.decMessage = args.decMessage.replace('\n', ' ');
		args.decMessage = encodeURI(args.decMessage);

		return axios.request({
			responseType: 'arraybuffer',
			url: `http://localhost:8080/api/gen.wav?dectalk=${args.decMessage}`,
			method: 'get',
			headers: {
				'Content-Type': 'audio/wav',
			},
		}).then(async (result) => {
			const outputFilename = './dectalkvc.wav';
			fs.writeFile(outputFilename, result.data, async function(err) {
				if (err) console.error(err);
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
		});

	}
}

module.exports = dectalkvcCommand;