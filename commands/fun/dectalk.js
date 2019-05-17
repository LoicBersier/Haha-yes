const { Command } = require('discord-akairo');
const axios = require('axios');
const fs = require('fs');

class dectalkCommand extends Command {
	constructor() {
		super('dectalk', {
			aliases: ['dectalk', 'dec'],
			category: 'fun',
			args: [
				{
					id: 'decMessage',
					type: 'string',
					match: 'rest'
				}
			],
			description: {
				content: 'Generate your text into dectalk',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message, args) {
		args.decMessage = encodeURI(args.decMessage);

		return axios.request({
			responseType: 'arraybuffer',
			url: `https://talk.moustacheminer.com/api/gen.wav?dectalk=${args.decMessage}`,
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