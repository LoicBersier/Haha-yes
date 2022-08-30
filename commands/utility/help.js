import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import fs from 'node:fs';

const { ownerId, prefix } = process.env;
const prefixs = prefix.split(',');

export default {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Displays a list of commands or information about a command.'),
	category: 'utility',
	async execute(interaction, args, client) {
		if (args[0]) {
			const command = client.commands.get(args[0]);
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
					type = 'True/False';
				}
				else if (constructorName.includes('mentionable')) {
					type = 'User';
				}
				else if (constructorName.includes('attachment')) {
					type = 'Attachment';
				}

				return `[${cmd.name}: ${type}]`;
			});

			const embed = new EmbedBuilder()
				.setColor(interaction.member ? interaction.member.displayHexColor : 'NAVY')
				.setTitle(`\`${prefixs[0]}${command.data.name} ${usage.join(' ')}\``)
				.addFields(
					{ name: 'Description', value: description.description },
				)
				.setFooter({ text: `All the available prefix: ${prefixs.join(' | ')}` });

			for (const field of description.fields) embed.addFields({ name: field.name, value: field.value });

			if (description.examples.length) {
				const text = `${prefixs[0]}${command.alias[0]}`;
				embed.addFields({ name: 'Examples', value: `\`${text} ${description.examples.join(`\`\n\`${text} `)}\``, inline: true });
			}

			if (command.alias) {
				console.log(command.alias.length);
				if (command.alias.length >= 1) {
					embed.addFields({ name: 'Aliases', value: `\`${command.alias.join('` `')}\``, inline: true });
				}

			}
			if (command.userPermissions) {
				embed.addFields({ name: 'User permission', value: `\`${command.userPermissions.join('` `')}\``, inline: true });
			}

			if (command.clientPermissions) {
				embed.addFields({ name: 'Bot permission', value: `\`${command.clientPermissions.join('` `')}\``, inline: true });
			}

			if (fs.existsSync(`./asset/img/command/${command.category}/${command.data.name}.png`)) {
				embed.attachFiles(`./asset/img/command/${command.category}/${command.data.name}.png`);
				embed.setImage(`attachment://${command.data.name}.png`);
			}
			return interaction.reply({ embeds: [embed] });
		}
		else {
			const embed = new EmbedBuilder()
				.setColor(interaction.member ? interaction.member.displayHexColor : 'NAVY')
				.addFields({ name: 'Command List', value: `This is a list of commands.\nTo view details for a command, do \`${prefixs[0]}help <command>\`.` })
				.setFooter({ text: `All the available prefix: ${prefixs.join('| ')}` });

			const object = { };
			for (const command of client.commands.values()) {
				if (command.category === 'secret') continue;
				if (object[command.category]) {
					object[command.category].push(command.data.name);
				}
				else {
					object[command.category] = [ command.data.name ];
				}
			}

			for (const category in object) {
				let title;
				if (interaction.user.id == ownerId) {
					title = {
						fun: '🎉\u2000Fun',
						utility: '🔩\u2000Utility',
						admin: '⚡\u2000Admin',
						owner: '🛠️\u2000Owner',
					}[category];
				}
				else {
					title = {
						fun: '🎉\u2000Fun',
						utility: '🔩\u2000Utility',
						admin: '⚡\u2000Admin',
					}[category];
				}

				embed.addFields({ name: title, value: `\`${object[category].join('` `')}\`` });
			}
			return interaction.reply({ embeds: [embed] });
		}
	},
};
