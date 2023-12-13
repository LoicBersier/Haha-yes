import { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, PermissionsBitField } from 'discord.js';
import fs from 'node:fs';
import ratelimiter from '../../utils/ratelimiter.js';

const { ownerId, prefix } = process.env;
const prefixs = prefix.split(',');

export default {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Displays a list of commands or information about a command.')
		.addStringOption(option =>
			option.setName('command')
				.setDescription('The command you want more details about.')),
	category: 'utility',
	async execute(interaction, args, client) {
		if (args.command) {
			const command = client.commands.get(args.command);
			if (!command) return interaction.reply(`Did not found any command named \`\`${args.command}\`\`. Please make sure it is a valid command and not an alias.`);
			const description = Object.assign({
				content: 'No description available.',
				usage: '',
				examples: [],
				fields: [],
			}, command.data);

			const usage = command.data.options.map(cmd => {
				let type = 'String';
				const constructorName = cmd.constructor.name.toLowerCase();
				if (constructorName.includes('boolean')) {
					if (interaction.isMessage) {
						type = `--${cmd.name}`;
					}
					else {
						type = 'True/False';
					}
				}
				else if (constructorName.includes('mentionable')) {
					type = 'User';
				}
				else if (constructorName.includes('attachment')) {
					type = 'Attachment';
				}

				return `[${cmd.name}: ${type}]`;
			});

			let p = '/';
			if (interaction.isMessage) {
				p = prefixs[0];
			}

			const embed = new EmbedBuilder()
				.setColor(interaction.member ? interaction.member.displayHexColor : 'Navy')
				.setTitle(`\`${p}${command.data.name} ${usage.join(' ')}\``)
				.addFields(
					{ name: 'Description', value: description.description },
				)
				.setFooter({ text: `All the available prefix: ${prefixs.join(' | ')}` });

			for (const field of description.fields) embed.addFields({ name: field.name, value: field.value });

			if (description.examples.length) {
				const text = `${prefixs[0]}${command.alias[0]}`;
				embed.addFields({ name: 'Examples', value: `\`${text} ${description.examples.join(`\`\n\`${text} `)}\``, inline: true });
			}
			else {
				const example = command.data.options.map(cmd => {
					let string = '"lorem ipsum"';
					const constructorName = cmd.constructor.name.toLowerCase();
					if (constructorName.includes('boolean')) {
						if (interaction.isMessage) {
							string = `--${cmd.name}`;
						}
						else {
							string = 'True/False';
						}
					}
					else if (constructorName.includes('mentionable')) {
						string = `@${interaction.user.username}`;
					}
					else if (constructorName.includes('attachment')) {
						string = 'Attachment';
					}

					if (!interaction.isMessage) {
						string = `\`\`${cmd.name}:${string}\`\``;
					}
					return string;
				});

				embed.addFields({ name: 'Example', value: `${p}${command.data.name} ${example.join(' ')}`, inline: true });
			}

			if (command.alias) {
				if (command.alias.length >= 1) {
					embed.addFields({ name: 'Aliases', value: `\`${command.alias.join('` `')}\``, inline: true });
				}

			}
			if (command.userPermissions) {
				const perm = [];
				command.userPermissions.forEach(permission => {
					perm.push(new PermissionsBitField(permission).toArray());
				});
				embed.addFields({ name: 'User permission', value: `\`${perm.join('` `')}\``, inline: true });
			}

			if (command.clientPermissions) {
				const perm = [];
				command.clientPermissions.forEach(permission => {
					perm.push(new PermissionsBitField(permission).toArray());
				});
				embed.addFields({ name: 'Bot permission', value: `\`${perm.join('` `')}\``, inline: true });
			}

			if (command.parallelLimit) {
				const paralellimit = ratelimiter.checkParallel(interaction.user, command.data.name, command);

				embed.addFields({ name: 'Current number of executions', value: `\`${paralellimit.current}\``, inline: false });
				embed.addFields({ name: 'Maximum number of executions', value: `\`${command.parallelLimit}\``, inline: true });
			}

			if (fs.existsSync(`./asset/img/command/${command.category}/${command.data.name}.png`)) {
				const file = new AttachmentBuilder(`./asset/img/command/${command.category}/${command.data.name}.png`);
				embed.setImage(`attachment://${command.data.name}.png`);
				return interaction.reply({ embeds: [embed], files: [file] });
			}
			return interaction.reply({ embeds: [embed] });
		}
		else {
			const embed = new EmbedBuilder()
				.setColor(interaction.member ? interaction.member.displayHexColor : 'Navy')
				.addFields({ name: 'Command List', value: `This is a list of commands.\nTo view details for a command, do \`${prefixs[0]}help <command>\`.` })
				.setFooter({ text: `All the available prefix: ${prefixs.join('| ')}` });

			const object = { };
			for (const command of client.commands.values()) {
				if (command.category === 'secret') continue;
				if (interaction.user.id !== ownerId && command.category === 'owner') continue;
				if (object[command.category]) {
					object[command.category].push(command.data.name);
				}
				else {
					object[command.category] = [ command.data.name ];
				}
			}

			for (const category in object) {
				const title = {
					fun: '🎉\u2000Fun',
					utility: '🔩\u2000Utility',
					admin: '⚡\u2000Admin',
					owner: '🛠️\u2000Owner',
					voice: '🗣️\u2000Voice',
					AI: '🦾\u2000AI',
				}[category];

				embed.addFields({ name: title, value: `\`${object[category].join('` `')}\`` });
			}
			return interaction.reply({ embeds: [embed] });
		}
	},
};
