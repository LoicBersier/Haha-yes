const { Command } = require('discord-akairo');
const axios = require('axios');
const fs = require('fs');
const rand = require('../../../rand.js');

class dectalkCommand extends Command {
	constructor() {
		super('dectalk', {
			aliases: ['dectalk', 'dec'],
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
				content: 'Send a wav of what you wrote into .wav with dectalk',
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
			url: `http://localhost/api/gen.wav?dectalk=${args.decMessage}`,
			method: 'get',
			headers: {
				'Content-Type': 'audio/wav',
			},
		}).then((result) => {
			const outputFilename = './dectalk.wav';
			fs.writeFileSync(outputFilename, result.data);
			return message.channel.send({files: ['./dectalk.wav']});
		});

	}
}

module.exports = dectalkCommand;