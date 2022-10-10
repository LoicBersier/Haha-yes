import { SlashCommandBuilder } from 'discord.js';
export default {
	data: new SlashCommandBuilder()
		.setName('invite')
		.setDescription('Generate invite link for the bot or another')
		.addMentionableOption(option =>
			option.setName('bot')
				.setDescription('The bot you want to make an invite link for.')
				.setRequired(false)),
	category: 'utility',
	async execute(interaction, args, client) {
		if (args.bot) {
			if (args.bot.user.bot) {
				return interaction.reply(`You can add the bot you mentioned with this link: https://discordapp.com/oauth2/authorize?client_id=${args.bot.id}&permissions=2684406848&scope=bot%20applications.commands\n\`Note: The invite will not work if the bot is not public\``);
			}
			else {
				return interaction.reply('I\'m sorry but the user you mentioned is not a bot!');
			}
		}
		else {
			return interaction.reply(`You can add me from here: https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=2684406848&scope=bot%20applications.commands`);
		}
	},
};
