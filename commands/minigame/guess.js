const { Command } = require('discord-akairo');
const guessLeaderboard = require('../../models').guessLeaderboard;
const { MessageEmbed } = require('discord.js');

class guessCommand extends Command {
	constructor() {
		super('guess', {
			aliases: ['guess'],
			category: 'minigame',
			args: [
				{
					id: 'leaderboard',
					type: 'flag',
					match: 'flag',
					flag: ['--leaderboard', '--top']
				},
			],
			description: {
				content: 'Guess the number ( Say "stop" to stop playing )',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message, args) {

		/*
		 *	TODO:
		 *
		 *	Make leaderboard look and work better
		 *	Separate by categories
		 *
		 */
		if (args.leaderboard) {
			const leaderboard = await guessLeaderboard.findAll({order: ['try']});
			let top = [];
			let leaderboardEmbed = new MessageEmbed()
				.setColor(message.member.displayHexColor)
				.setTitle('Guess leaderboard');
			for (let i = 0; i < leaderboard.length; i++) {
				this.client.users.fetch(leaderboard[i].get('memberID'))
					.then(user => {
						let body = `**${user.username}**\nTry: ${leaderboard[i].get('try')}`;
						top.push(body);

						if (leaderboard[i].get('difficulty') == 'Easy') {
							leaderboardEmbed.addField('Easy', body, true);
						} else if (leaderboard[i].get('difficulty') == 'Normal') {
							leaderboardEmbed.addField('Normal', body, true);
						} else if (leaderboard[i].get('difficulty') == 'Hard') {
							leaderboardEmbed.addField('Hard', body, true);
						}
						
						if (i + 1 == leaderboard.length) {
							return message.channel.send(leaderboardEmbed);
						}						
					});	
			}
			return;
		}

		message.reply('1. Easy ( 0 - 100 )\n2. Normal ( 0 - 1000 )\n3. Hard ( 0 - 10000 )');
		const filter = m =>  m.content && m.author.id == message.author.id;
		message.channel.awaitMessages(filter, {time: 10000, max: 1, errors: ['time'] })
			.then(messages => {
				let max;
				let difficulty;

				if (messages.map(messages => messages.content)[0] == 1) {
					max = 100;
					difficulty = 'Easy';
				} else if (messages.map(messages => messages.content)[0] == 2) {
					max = 1000;
					difficulty = 'Normal';
				} else if (messages.map(messages => messages.content)[0] == 3) {
					max = 10000;
					difficulty = 'Hard';
				} else {
					return message.reply('This isin\'t a valid difficulty number! Please try again.');
				}
				
				let secretnumber = Math.floor((Math.random() * max) + 1);
				let numberTry = 0;
				console.log(secretnumber);

				message.reply('What is the number?');
				message.channel.awaitMessages(filter, {max: 1})
					.then(input => {
						checkNumber(input.map(input => input.content)[0]);
					});
				
				function tryAgain (input) {
					if (input != secretnumber) {
						if (input > secretnumber) {
							message.reply('Its less!\nWhat is the number?');
						} else if (input < secretnumber) {
							message.reply('Its more!\nWhat is the number?');
						}
					}
					message.channel.awaitMessages(filter, {max: 1})
						.then(input => {
							checkNumber(input.map(input => input.content)[0]);
						});
				}

				async function checkNumber (input) {
					numberTry++;
					if (input.toLowerCase() == 'stop') {
						return message.reply('Ok, let\'s stop playing :(');
					} else if (input != secretnumber) {
						tryAgain(input);
					} else {
						const leaderboard = await guessLeaderboard.findOne({where: {memberID: message.author.id, difficulty: difficulty}});
						if (!leaderboard) {
							const body = {memberID: message.author.id, try: numberTry, difficulty:difficulty};
							await guessLeaderboard.create(body);
						} else {
							const body = {memberID: message.author.id, try: numberTry, difficulty:difficulty};
							await guessLeaderboard.update(body, {where: {memberID: message.author.id, difficulty: difficulty}});
						}

						if (numberTry > 1) {
							return message.reply(`Congratulations! You won! It took you ${numberTry} turns!`);
						} else {
							return message.reply('Congratulations! You won! It took you 1 Turn!');
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