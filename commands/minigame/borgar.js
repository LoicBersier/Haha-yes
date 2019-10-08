// TODO:
// Higher the level the less time you have to complete it
// Make the command less shit
const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const borgar = require('../../models').borgar;

class borgarCommand extends Command {
	constructor() {
		super('borgar', {
			aliases: ['borgar', 'hamburgor', 'hamborgar', 'burger', 'hamburger', 'borger'],
			category: 'minigame',
			description: {
				content: 'Make amborgar,,,,,,,,,, ( MINI GAME VERY WIP, NO LEVEL YET )',
				usage: '[number of ingredient] [time]',
				examples: ['4 10']
			}
		});
	}

	async exec(message) {
		let level;
		let curxp;
		let xp = Math.floor((Math.random() * 23) + 1);

		const userInfo = await borgar.findOne({where: {userID:message.author.id}});

		if (userInfo) {
			curxp = userInfo.get('xp');

			if (curxp < 100) {
				level = 1;
			} else if (curxp >= 100) {
				level = 2;
			} else if (curxp >= 200) {
				level = 3;
			} else if (curxp >= 300) {
				level = 4;
			} else if (curxp >= 400) {
				level = 5;
			} else if (curxp >= 500) {
				level = 6;
			}
		} else {
			curxp = 0;
			level = 1;
		}

		const ingredients = ['beef', 'salade', 'tomato', 'cheese', 'pickle', 'onion', 'garlic', 'basil', 'lettuce'];
		let hamIngredient = [];
		hamIngredient.push('bun');

		for (let i = 1; i < level + Math.floor(Math.random() * 2) + 1; i++) {
			hamIngredient[i] = ingredients[Math.floor(Math.random() * ingredients.length)];
		}
		hamIngredient.push('bun');


		let borgarEmbed = new MessageEmbed()
			.setTitle('hamborger info')
			.setDescription(`could you do me an **amborgar** that contain **${hamIngredient}**`)
			.setFooter(`Level ${level} | Once the ingredients dissapear you have 10 seconds to do it!`)
			.setTimestamp();

		message.util.send(borgarEmbed)
			.then(() => {
				setTimeout(async () => {
					borgarEmbed = new MessageEmbed()
						.setTitle('hamborger delivery')
						.setDescription('You have to put each ingredients in seperate messages!')
						.setFooter(`Level ${level} | you have 10 seconds to make that hamborgor`)
						.setTimestamp();
					message.util.edit(borgarEmbed);

					const filter = m =>  m.content && m.author.id == message.author.id;
					message.channel.awaitMessages(filter, {time: 10 * 1000, max: hamIngredient.length, errors: ['time'] })
						.then(messages => {
							let userIngredient = messages.map(messages => messages.content);
							let body;

							if (userIngredient.toString().toLowerCase() == hamIngredient.toString().toLowerCase()) {
								let totalXP = curxp + xp;
								body = {userID: message.author.id, level: level, xp: totalXP};
								if (curxp == 0) {
									message.reply(`u won bro,,,, that's kinda epic if i do say so myself\n**you gained ${xp} xp.**`);
								} else {
									message.reply(`u won bro,,,, that's kinda epic if i do say so myself\n**you gained ${xp} xp. you now have ${totalXP} xp**`);
								}
							} else {
								let totalXP = curxp - xp;
								body = {userID: message.author.id, level: level, xp: totalXP};
								if (curxp == 0) {
									message.reply(`you failed noob... you were supposed to make **${hamIngredient}**`);
								} else {
									message.reply(`you failed noob... you were supposed to make **${hamIngredient}**\n**you lost ${xp} xp. you now have ${totalXP} xp**`);
								}
							}

							if (curxp == 0) {
								borgar.create(body);
							} else {
								borgar.update(body, {where: {userID:message.author.id}});
							}
						})
						.catch(err => {
							console.error(err);
							return message.reply('You ran out of time noob... ( or an error occured )');
						});
				}, 3000);
			});
	}
}

module.exports = borgarCommand;