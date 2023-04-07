import { PermissionFlagsBits, InteractionType } from 'discord.js';
import db from '../../models/index.js';
import ratelimiter from '../../utils/ratelimiter.js';

const { ownerId } = process.env;

export default {
	name: 'interactionCreate',
	async execute(interaction) {
		const client = interaction.client;
		if (interaction.type !== InteractionType.ApplicationCommand) return;

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

		const isOptOut = await db.optout.findOne({ where: { userID: interaction.user.id } });

		if (isOptOut) {
			console.log(`A user launched command \x1b[33m${commandName}\x1b[0m with slash`);
		}
		else {
			console.log(`\x1b[33m${userTag} (${userID})\x1b[0m launched command \x1b[33m${commandName}\x1b[0m with slash`);
		}


		// Owner only check
		if (command.ownerOnly && interaction.user.id !== ownerId) {
			return interaction.reply({ content: '❌ This command is reserved for the owner!', ephemeral: true });
		}

		// Check if the bot has the needed permissions
		if (command.default_permission) {
			const clientMember = await interaction.guild.members.fetch(client.user.id);
			if (!clientMember.permissions.has(command.clientPermissions)) {
				return interaction.reply({ content: `❌ I am missing one of the following permission(s): \`${new PermissionFlagsBits(command.clientPermissions).toArray()}\``, ephemeral: true });
			}
		}

		// Check if the user has the needed permissions
		/*
		if (command.default_member_permissions) {
			if (!interaction.member.permissions.has(command.userPermissions)) {
				return interaction.reply({ content: `❌ You are missing one of the following permission(s): \`${new PermissionFlagsBits(command.userPermissions).toArray()}\``, ephemeral: true });
			}
		}
		*/

		// Check the ratelimit
		const doRateLimit = ratelimiter.check(interaction.user, commandName, command);
		if (doRateLimit) {
			return interaction.reply({ content: doRateLimit, ephemeral: true });

		}

		try {
			interaction.prefix = '/';

			const args = {};
			// https://discord-api-types.dev/api/discord-api-types-v10/enum/ApplicationCommandOptionType
			interaction.options.data.forEach(arg => {
				let payload = arg.value;
				if (arg.type === 9) {
					payload = arg.member;
				}
				else if (arg.type === 11) {
					payload = arg.attachment;
				}
				args[arg.name] = payload;
			});

			if (!isOptOut) {
				console.log(`\x1b[33m⤷\x1b[0m with args ${JSON.stringify(args)}`);
			}

			await command.execute(interaction, args, client);
		}
		catch (error) {
			console.error(error);
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	},
};
