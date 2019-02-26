const { Command } = require('discord-akairo');
const fs = require('fs');

class censorCommand extends Command {
	constructor() {
		super('censor', {
			aliases: ['censor'],
			category: 'owner',
			ownerOnly: 'true',
			args: [
				{
					id: 'word',
					type: 'string',
					match: 'rest'
				}
			],
			description: {
				content: 'Censor word for twitter',
				usage: '[word]',
				examples: ['nigger']
			}
		});
	}

	async exec(message, args) {
		let word = args.word;

		word = word.toLowerCase();

		let words = [];
		let json = JSON.stringify(words);

		fs.readFile('./json/twitter/censor.json', 'utf8', function readFileCallback(err, data) {
			if (err) {
				fs.writeFile('./json/twitter/censor.json', `["${word}"]`, function (err) {
					if (err) {
						
						console.log(err);
					}
				});
			} else {
				words = JSON.parse(data); //now it an object
				words.push(word);
				json = JSON.stringify(words); //convert it back to json
				fs.writeFile('./json/twitter/censor.json', json, 'utf8', function (err) {
					if (err) {
						return console.log(err);
					}
				});
			}
		});

		
		return message.channel.send(`censored the word ${word}`);
	}
}

module.exports = censorCommand;