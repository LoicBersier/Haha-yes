import db from '../../models/index.js';
const ratelimit = {};

import dotenv from 'dotenv';
dotenv.config();
const { ownerId } = process.env;

export default {
	name: 'interactionCreate',
	async execute(interaction) {
		const client = interaction.client;
		if (!interaction.isCommand()) return;

		const globalBlacklist = await db.Blacklists.findOne({ where: { type:'global', uid:interaction.user.id } });
		const commandBlacklist = await db.Blacklists.findOne({ where: { type:interaction.commandName, uid:interaction.user.id } });
		if (globalBlacklist) {
			return interaction.reply({ content: `You are globally blacklisted for the following reason: \`${globalBlacklist.reason}\``, ephemeral: true });
		}
		else if (commandBlacklist) {
			return interaction.reply({ content: `You are blacklisted for the following reason: \`${commandBlacklist.reason}\``, ephemeral: true });
		}

		const userTag = interaction.user.tag;
		const userID = interaction.user.id;
		const commandName = interaction.commandName;

		const command = client.commands.get(commandName);

		if (!command) return;

		console.log(`\x1b[33m${userTag} (${userID})\x1b[0m launched command \x1b[33m${commandName}\x1b[0m`);

		if (command.ownerOnly && interaction.user.id !== ownerId) {
			return interaction.reply({ content: '❌ This command is reserved for the owner!', ephemeral: true });
		}

		try {
			const date = new Date();
			if (ratelimit[userID]) {
				if (ratelimit[userID].cooldown) {
					if (commandName === ratelimit[userID].command && date > ratelimit[userID].cooldown) {
						ratelimit[userID].limit = 0;
						ratelimit[userID].cooldown = undefined;
					}
				}

				if (commandName === ratelimit[userID].command && command.ratelimit === ratelimit[userID].limit) {
					return await interaction.reply({ content: `You are being rate limited. You can try again in ${Math.floor((ratelimit[userID].cooldown - date) / 1000)} seconds.`, ephemeral: true });

				}
			}
			if (command.ratelimit) {
				ratelimit[userID] = { command: commandName, limit: ratelimit[userID] ? ratelimit[userID].limit + 1 : 1 };
				if (command.ratelimit === ratelimit[userID].limit) {
					date.setSeconds(date.getSeconds() + command.cooldown);

					ratelimit[userID] = { command: commandName, limit: ratelimit[userID].limit, cooldown: date };
				}
			}
			await command.execute(interaction);
		}
		catch (error) {
			console.error(error);
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	},
};
