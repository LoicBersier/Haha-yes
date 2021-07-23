const { Command } = require('discord-akairo');

class rpsCommand extends Command {
	constructor() {
		super('rps', {
			aliases: ['rps', 'rockpapersci'],
			category: 'minigame',
			clientPermissions: ['SEND_MESSAGES'],
			args: [
				{
					id: 'selection',
					type: 'string',
					match: 'rest',
				},
			],
			description: {
				content: 'Simply rock paper scissors\nCredit to: druid#0425 (276882603158798336)',
				usage: '[rock/paper/scissors]',
				examples: ['rock']
			}
		});
	}

	async exec(message, args) {
		let pcHand = Math.floor((Math.random()*3)+1);
		let playerHand = args.selection;

		switch (playerHand) {
		case 'rock':
			if (pcHand==1) {
				message.reply('You both chose rock!');
			} else if (pcHand==2) {
				message.reply('The bot chose paper, you lose!');
			} else {
				message.reply('The bot chose scissors, you win!');
			}
			break;
		case 'paper':
			if (pcHand==1) {
				message.reply('You both chose paper!');
			} else if (pcHand==2) {
				message.reply('The bot chose scissors, you lose!');
			} else {
				message.reply('The bot chose rock, you win!');
			}
			break;
		case 'scissors':
			if (pcHand==1) {
				message.reply('You both chose scissors!');
			} else if (pcHand==2) {
				message.reply('The bot chose rock, you lose!');
			} else {
				message.reply('The bot chose paper, you win!');
			}
			break;
		
		default:
			message.reply(`You entered ${playerHand} which is an incorrect choice. Try again with rock, paper or scissors`);
			break;
		}

	}
}

module.exports = rpsCommand;
