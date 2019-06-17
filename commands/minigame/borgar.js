// TODO:
// Make a level system per user and increasse difficutly based on the level
// higher the level the more ingredient required
// higher the level the less time you have to complete it
const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class borgarCommand extends Command {
	constructor() {
		super('borgar', {
			aliases: ['borgar', 'hamburgor', 'hamborgar', 'burger', 'hamburger'],
			category: 'minigame',
			args: [
				{
					id: 'ingredientNumber',
					type: 'int',
					default: 4
				},
				{
					id: 'time',
					type: 'int',
					default: 10000
				}
			],
			description: {
				content: 'Make amborgar,,,,,,,,,, ( MINI GAME VERY WIP, NO LEVEL YET )',
				usage: '[number of ingredient] [time]',
				examples: ['4 10000']
			}
		});
	}

	async exec(message, args) {
		const ingredient = [ 'bun', 'beef', 'salade', 'tomato', 'cheese', 'pickle'];
		let hamIngredient = [];
		for (let i = 0; i < args.ingredientNumber; i++) {
			hamIngredient[i] = ingredient[Math.floor( Math.random() * ingredient.length )];
		}


		const borgarEmbed = new MessageEmbed()
			.setTitle('hamborger delivery')
			.setDescription(`could you do me an **amborgar** that contain **${hamIngredient}**`)
			.setFooter(`Level 0 | you have 10 seconds ${args.time} to make that hamborgor`)
			.setTimestamp();

		message.channel.send(borgarEmbed);

		const filter = m =>  m.content && m.author.id == message.author.id;
		message.channel.awaitMessages(filter, {time: args.time * 1000, errors: ['time'] })
			.catch(collected => {
				let userIngredient = collected.map(collected => collected.content);
				console.log(hamIngredient + '\n' + userIngredient);
				if (userIngredient.toString().toLowerCase() == hamIngredient.toString()) {
					return message.reply('u won bro,,,, that\'s kinda epic if i do say so myself');
				} else {
					if (userIngredient.length == hamIngredient.length) {
						return message.reply(`you failed noob... you were supposed to make ${hamIngredient}`);
					} else if (userIngredient.length > hamIngredient.length) {
						return message.reply('Too much ingredient...');
					} else {
						return message.reply('time runned out noob...');
					}
				}
			});

	}
}

module.exports = borgarCommand;