/* eslint-disable no-case-declarations */
import { SlashCommandBuilder } from 'discord.js';
const { ownerId } = process.env;

export default {
	data: new SlashCommandBuilder()
		.setName('s')
		.setDescription('What could this be 🤫')
		.addStringOption(option =>
			option.setName('something')
				.setDescription('🤫')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('somethingelse')
				.setDescription('🤫')
				.setRequired(false)),
	category: 'secret',
	async execute(interaction, args, client) {
		const command = args.something;

		switch (command) {
		case 'levertowned':
			return interaction.reply('Hello buddy bro <:youngtroll:488559163832795136> <@434762632004894746>');
		case 'owned':
			const epicMessage = ['You cheated not ONLY the GAME, BUT yourself. You didn\'t GROW. You didn\'t IMPROVE. You TOOK a SHORTCUT and gained NOTHING. You EXPERIENCED a HOLLOW victory. NOTHING WAS risked and NOTHING WAS gained. It\'s SAD that you don\'t KNOW the DIFFERENCE.', 'TROLOLOLO OWNED EPIC STYLE', 'Owned noob', 'HAHA BRO YOU JUST GOT OOOOOOOOWNED HAHAHAHAHHAHA NOOOB NOOOOB NOOOB OWNED NOOB <:youngtroll:488559163832795136>', '<a:op:516341492982218756> op op op owned epic style <a:op:516341492982218756>', 'HAHAHA BRO YOU HAVE BEEN OWNED TROLL BRO STYLE', 'OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED YOU JUST GOT OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED YOU JUST GOT OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED YOU JUST GOT OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED YOU JUST GOT OWNED', 'OWNED\nFUCKING OWNED', 'OWNED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', 'You just got owned <a:troll:525724709833277442>', 'you just been....epicly trolled <:trole:241942993022615552>', 'I hope you have a nice day, just a simple reminder that I love you and I think you\'re pretty epic!!!!'];

			const ownedMessage = epicMessage[Math.floor(Math.random() * epicMessage.length)];

			await interaction.guild.members.fetch();
			let owned = args.somethingelse ? interaction.guild.members.cache.find(u => u.user.username.toLowerCase().includes(args.somethingelse.toLowerCase())) : null;
			if (interaction.isMessage) {
				if (interaction.mentions.members.first()) {
					console.log('test');
					owned = interaction.mentions.members.first();
				}
			}

			if (args.somethingelse) {

				if (owned.id === client.user.id) {
					return interaction.reply('You really thought you could own me?, pathetic...');
				}
				else if (owned.id === ownerId) {
					return interaction.reply('You really thought you could own him?, pathetic...');
				}
				else if (owned.id === '286054184623538177' || owned.id === '172112210863194113') {
					owned = interaction.user;
				}


				if (ownedMessage === epicMessage[0]) {
					return interaction.reply(ownedMessage);
				}

				return interaction.reply(`${owned}, ${ownedMessage}`);
			}
			else {
				return interaction.reply(ownedMessage);
			}
		case 'fartpiss':
			if (interaction.guild.id != '240843640375607296') {
				return;
			}

			await interaction.guild.members.fetch();
			const member = args.somethingelse ? interaction.guild.members.cache.find(u => u.user.username.toLowerCase().includes(args.somethingelse.toLowerCase())) : null;

			if (member) {
				return await member.setNickname('fart piss')
					.then(() => interaction.reply(`sucessfully fart pissed on ${member.user.username} <:youngtroll:488559163832795136>`))
					.catch((error) => {
						if (process.env.NODE_ENV === 'development') console.error(error);
						interaction.reply(`Sorry i could not fart piss on ${member.user.username} :(`);
					});


			}
			else {
				return await interaction.member.setNickname('fart piss')
					.then(() => interaction.reply('sucessfully fart pissed on you <:youngtroll:488559163832795136>'))
					.catch((error) => {
						if (process.env.NODE_ENV === 'development') console.error(error);
						interaction.reply('Sorry i could not fart piss on you :(');
					});
			}
		default:
			break;
		}
	},
};
