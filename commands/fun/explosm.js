const { Command } = require('discord-akairo');
const extract = require('meta-extractor');

class explosmCommand extends Command {
	constructor() {
		super('explosm', {
			aliases: ['explosm', 'rcg'],
			category: 'fun',
			clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
			description: {
				content: 'Comic randomly generated from http://explosm.net/rcg',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message) {
		extract({ uri: 'http://explosm.net/rcg' }, (err, res) => {
			return message.channel.send({files: [res.ogImage]});
		});
	}
			
}
module.exports = explosmCommand;