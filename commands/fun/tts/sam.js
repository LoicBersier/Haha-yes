const { Command } = require('discord-akairo');
const axios = require('axios');
const fs = require('fs');

class samCommand extends Command {
	constructor() {
		super('sam', {
			aliases: ['sam'],
			category: 'fun',
			args: [
				{
					id: 'samMessage',
					type: 'string',
					match: 'rest'
				}
			],
			description: {
				content: 'Send a mp3 of what you wrote in Microsoft Sam tts',
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
		}).then((result) => {
			const outputFilename = './sam.mp3';
			fs.writeFileSync(outputFilename, result.data);
			return message.channel.send({files: ['./sam.mp3']});
		});

	}
}

module.exports = samCommand;