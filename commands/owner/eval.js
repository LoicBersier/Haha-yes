const { Command } = require('discord-akairo');

class EvalCommand extends Command {
	constructor() {
		super('eval', {
			aliases: ['eval'],
			split: 'none',
			category: 'owner',
			args: [
				{
					id: 'eval',
					type: 'string'
				}
			],
			ownerOnly: 'true',
			description: {
				content: 'Execute javascript',
				usage: '[code]',
				examples: ['message.channel.send(\'Hi\')']
			}
		});
	}

	async exec(message, args) {
		const clean = text => {
			if (typeof(text) === 'string')
				return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
			else
				return text;
		};

		try {
			const code = args.eval;
			let evaled = eval(code);
		
			if (typeof evaled !== 'string')
				evaled = require('util').inspect(evaled);
		
			message.channel.send(clean(evaled), {code:'xl'});
		} catch (err) {
			message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
		}
	}
}

module.exports = EvalCommand;