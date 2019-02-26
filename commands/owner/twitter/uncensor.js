const { Command } = require('discord-akairo');
const fs = require('fs');

class uncensorCommand extends Command {
	constructor() {
		super('uncensor', {
			aliases: ['uncensor'],
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
				content: 'Unensor word for twitter',
				usage: '[word]',
				examples: ['shit']
			}
		});
	}

	async exec(message, args) {
		let word = args.word;
		
		let words = [];
		let json = JSON.stringify(words);

		fs.readFile('./json/twitter/uncensor.json', 'utf8', function readFileCallback(err, data) {
			if (err) {
				fs.writeFile('./json/twitter/uncensor.json', `["${word}"]`, function (err) {
					if (err) {
						
						console.log(err);
					}
				});
			} else {
				words = JSON.parse(data); //now it an object
				words.push(word);
				json = JSON.stringify(words); //convert it back to json
				fs.writeFile('./json/twitter/uncensor.json', json, 'utf8', function (err) {
					if (err) {
						return console.log(err);
					}
				});
			}
		});

		
		return message.channel.send(`Uncensored the word ${word}`);
	}
}

module.exports = uncensorCommand;