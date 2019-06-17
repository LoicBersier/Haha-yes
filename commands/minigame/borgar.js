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
					id: 'IngredientNumber',
					type: 'int',
					default: 4
				},
				{
					id: 'Time',
					type: 'int',
					default: 10000
				}
			],
			description: {
				content: 'Make amborgar,,,,,,,,,, ( MINI GAME VERY WIP, NO LEVEL YET )',
				usage: '[number of ingredient] [time in miliseconds]',
				examples: ['4 10000']
			}
		});
	}

	async exec(message, args) {
		const ingredient = [ 'bun', 'beef', 'salade', 'tomato', 'cheese', 'pickle'];
		let hamIngredient = [];
		for (let i = 0; i < args.IngredientNumber; i++) {
			hamIngredient[i] = ingredient[Math.floor( Math.random() * ingredient.length )];
		}


		const borgarEmbed = new MessageEmbed()
			.setTitle('hamborger delivery')
			.setDescription(`could you do me an **amborgar** that contain ${hamIngredient}`)
			.setFooter('Level 0 | you have 10 seconds to make that hamborgor')
			.setTimestamp();

		message.channel.send(borgarEmbed);

		const filter = m => m.content;
		message.channel.awaitMessages(filter, { time: 10000, errors: ['time'] })
			.catch(collected => {
				console.log(collected.map(collected => collected.content));
				let userIngredient = collected.map(collected => collected.content);
				for (let i = 0; i < hamIngredient.length; i++) {
					if (userIngredient[i] == hamIngredient[i]) {
						return message.channel.send('u won bro,,,, that\'s kinda epic if i do say so myself');
					} else {
						return message.channel.send(`you failed at **${userIngredient[i]}** it should have been **${hamIngredient[i]}** noob...`);
					}
				}

			});

	}
}

module.exports = borgarCommand;