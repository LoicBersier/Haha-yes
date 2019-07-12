// TODO:
// Make a level system per user and increasse difficutly based on the level
// higher the level the more ingredient required
// higher the level the less time you have to complete it
const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class borgarCommand extends Command {
	constructor() {
		super('borgar', {
			aliases: ['borgar', 'hamburgor', 'hamborgar', 'burger', 'hamburger', 'borger'],
			category: 'minigame',
			args: [
				{
					id: 'ingredientNumber',
					type: 'number',
					default: 4
				},
				{
					id: 'time',
					type: 'number',
					default: 10
				}
			],
			description: {
				content: 'Make amborgar,,,,,,,,,, ( MINI GAME VERY WIP, NO LEVEL YET )',
				usage: '[number of ingredient] [time]',
				examples: ['4 10']
			}
		});
	}

	async exec(message, args) {
		if (args.time <= 0) args.time = 1;
		const ingredients = [ 'bun', 'beef', 'salade', 'tomato', 'cheese', 'pickle', 'onion', 'garlic', 'basil'];
		let hamIngredient = [];
		for (let i = 0; i < args.ingredientNumber; i++) {
			hamIngredient[i] = ingredients[Math.floor( Math.random() * ingredients.length )];
		}


		let borgarEmbed = new MessageEmbed()
			.setTitle('hamborger delivery')
			.setDescription(`could you do me an **amborgar** that contain **${hamIngredient}**`)
			.setFooter(`Level 0 | Once the ingredients dissapear you have ${args.time} seconds to do it!`)
			.setTimestamp();

		message.util.send(borgarEmbed)
			.then(() => {
				setTimeout(async () => {
					borgarEmbed = new MessageEmbed()
						.setTitle('hamborger delivery')
						.setDescription('You have to put each ingredients in seperate message!')
						.setFooter(`Level 0 | you have ${args.time} seconds to make that hamborgor`)
						.setTimestamp();
					message.util.edit(borgarEmbed);

					const filter = m =>  m.content && m.author.id == message.author.id;
					message.channel.awaitMessages(filter, {time: args.time * 1000, max: hamIngredient.length, errors: ['time'] })
						.then(messages => {
							let userIngredient = messages.map(messages => messages.content);

							if (userIngredient.toString().toLowerCase() == hamIngredient.toString()) {
								return message.reply('u won bro,,,, that\'s kinda epic if i do say so myself');
							} else if (userIngredient.length == hamIngredient.length) {
								return message.reply(`you failed noob... you were supposed to make **${hamIngredient}**`);
							} else if (userIngredient.length > hamIngredient.length) {
								return message.reply('Too much ingredient...');
							}
						})
						.catch(() => {
							return message.reply('time runned out noob...');
						});
				}, 3000);
			});
	}
}

module.exports = borgarCommand;