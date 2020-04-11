const { Command } = require('discord-akairo');
const fs = require('fs');

class HelpCommand extends Command {
	constructor() {
		super('help', {
			aliases: ['help', 'halp', 'h'],
			category: 'utility',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					id: 'command',
					type: 'commandAlias',
					prompt: {
						start: 'Which command do you need help with?',
						retry: 'Please provide a valid command.',
						optional: true
					},
					match: 'rest'
				}
			],
			description: {
				content: 'Displays a list of commands or information about a command.',
				usage: '[command]',
				examples: ['', 'say', 'tag']
			}
		});
	}

	exec(message, { command }) {
		if (!command) return this.execCommandList(message);

		const description = Object.assign({
			content: 'No description available.',
			usage: '',
			examples: [],
			fields: []
		}, command.description);

		const embed = this.client.util.embed()
			.setColor(message.member ? message.member.displayHexColor : 'NAVY')
			.setTitle(`\`${this.client.commandHandler.prefix[0]}${command.aliases[0]} ${description.usage}\``)
			.addField('Description', description.content)
			.setFooter(`All the available prefix: ${this.client.commandHandler.prefix.join(' | ')}`);

		for (const field of description.fields) embed.addField(field.name, field.value);

		if (description.examples.length) {
			const text = `${this.client.commandHandler.prefix[0]}${command.aliases[0]}`;
			embed.addField('Examples', `\`${text} ${description.examples.join(`\`\n\`${text} `)}\``, true);
		}

		if (command.aliases.length > 1) {
			embed.addField('Aliases', `\`${command.aliases.join('` `')}\``, true);
		}

		if (command.userPermissions) {
			embed.addField('User permission', `\`${command.userPermissions.join('` `')}\``, true);
		}

		if (command.clientPermissions) {
			embed.addField('Bot permission', `\`${command.clientPermissions.join('` `')}\``, true);
		}

		if (command.contentParser.flagWords.length) {
			embed.addField('Command flags', `\`${command.contentParser.flagWords.join('` `')}\``, true);
		}

		if (command.contentParser.optionFlagWords.length) {
			embed.addField('Command options flags', `\`${command.contentParser.optionFlagWords.join('` `')}\``, true);
		}

		if (fs.existsSync(`./asset/img/command/${command.category.id}/${command.id}.png`)) {
			embed.attachFiles(`./asset/img/command/${command.category.id}/${command.id}.png`);
			embed.setImage(`attachment://${command.id}.png`);
		}

		return message.util.send({ embed });
	}

	async execCommandList(message) {
		const embed = this.client.util.embed()
			.setColor(message.member ? message.member.displayHexColor : 'NAVY')
			.addField('Command List',
				[
					'This is a list of commands.',
					`To view details for a command, do \`${this.client.commandHandler.prefix[0]}help <command>\`.`
				])
			.setFooter(`All the available prefix: ${this.client.commandHandler.prefix.join(' | ')}`);

		for (const category of this.handler.categories.values()) {
			let title;
			if (message.author.id == this.client.ownerID) {
				title = {
					general: '📝\u2000General',
					fun: '🎉\u2000Fun',
					minigame: '🕹\u2000Minigames (WIP)',
					images: '🖼\u2000Images',
					utility: '🔩\u2000Utility',
					admin: '⚡\u2000Admin',
					owner: '🛠️\u2000Owner',
				}[category.id];
			} else {
				title = {
					general: '📝\u2000General',
					fun: '🎉\u2000Fun',
					minigame: '🕹\u2000Minigames (WIP)',
					images: '🖼\u2000Images',
					utility: '🔩\u2000Utility',
					admin: '⚡\u2000Admin',
				}[category.id];
			}

			if (title) embed.addField(title, `\`${category.map(cmd => cmd.aliases[0]).join('` `')}\``);
		}

		const shouldReply = message.guild && message.channel.permissionsFor(this.client.user).has('SEND_MESSAGES');

		try {
			await message.author.send({ embed });
			if (shouldReply) return message.util.reply('I\'ve sent you a DM with the command list.');
		} catch (err) {
			if (shouldReply) return message.util.send({ embed });
		}

		return undefined;
	}
}

module.exports = HelpCommand;
