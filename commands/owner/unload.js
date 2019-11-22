const { Command } = require('discord-akairo');
const fs = require('fs');

class unloadCommand extends Command {
	constructor() {
		super('unload', {
			aliases: ['unload'],
			category: 'owner',
			ownerOnly: 'true',
			args: [
				{
					id: 'command',
					type: 'string',
				},
				{
					id: 'noplaceholder',
					match: 'flag',
					flag: ['--noplaceholder', '-n']
				}
			],
			description: {
				content: 'Unload command (use "-n" if you do **not** want a placeholder for this command)',
				usage: '[command]',
				examples: ['ping']
			}
		});
	}

	async exec(message, args) {
		this.handler.remove(args.command);
		if (!args.noplaceholder) {
			fs.writeFile(`./${args.command}_unloaded.js`, `const { Command } = require('discord-akairo');
			
			class ${args.command}Command extends Command {
				constructor() {
					super('${args.command}', {
						aliases: ['${args.command}'],
						description: {
							content: 'unloaded command',
							usage: '[]',
							examples: ['']
						}
					});
				}
			
				async exec(message) {
					return message.channel.send('This command is unloaded, please check back later.');
				}
			}
			
			module.exports = ${args.command}Command;`,() => {
				this.handler.load(`${__dirname}/../../${args.command}_unloaded.js`);
			});
		}
		return message.channel.send(`Sucessfully unloaded command ${args.command}`);
	}
}

module.exports = unloadCommand;