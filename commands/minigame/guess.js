const { Command } = require('discord-akairo');

class guessCommand extends Command {
	constructor() {
		super('guess', {
			aliases: ['guess'],
			category: 'minigame',
			description: {
				content: 'Guess the number',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message) {
		message.channel.send('1. Easy ( 0 - 100 )\n2. Medium ( 0 - 1000 )\n3. Hard ( 0 - 10000 )');
		const filter = m =>  m.content && m.author.id == message.author.id;
		message.channel.awaitMessages(filter, {time: 10000, max: 1, errors: ['time'] })
			.then(messages => {
				let max;

				if (messages.map(messages => messages.content)[0] == 1) {
					max = 100;
				} else if (messages.map(messages => messages.content)[0] == 2) {
					max = 1000;
				} else if (messages.map(messages => messages.content)[0] == 3) {
					max = 10000;
				} else {
					return message.channel.send('This isin\'t a valid difficulty number! Please try again.');
				}
				
				let secretnumber = Math.floor((Math.random() * max) + 1);
				let numberTry = 0;
				console.log(secretnumber);

				message.channel.send('What is the number?');
				message.channel.awaitMessages(filter, {time: 10000, max: 1})
					.then(input => {
						checkNumber(input.map(input => input.content)[0]);
					});
				
				function tryAgain (input) {
					if (input != secretnumber) {
						if (input > secretnumber) {
							message.channel.send('Its less!');
						} else if (input < secretnumber) {
							message.channel.send('Its more!');
						}
					}
					message.channel.send('What is the number?');
					message.channel.awaitMessages(filter, {time: 10000, max: 1})
						.then(input => {
							checkNumber(input.map(input => input.content)[0]);
						});
				}

				function checkNumber (input) {
					numberTry++;
					if (input != secretnumber) {
						tryAgain(input);
					} else {
						if (numberTry > 1) {
							return message.channel.send(`Congratulations! You won! It took you ${numberTry} turns!`);
						} else {
							return message.channel.send('Congratulations! You won! It took you 1 Turn!');
						}
					}
				}
			})
			.catch(() => {
				return message.reply('Timed out');
			});
	}
}

module.exports = guessCommand;