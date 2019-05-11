const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class EvalCommand extends Command {
	constructor() {
		super('eval', {
			aliases: ['eval'],
			category: 'owner',
			args: [
				{
					id: 'eval',
					type: 'string',
					match: 'rest'
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

			const evalEmbed = new MessageEmbed()
				.setColor('#00FF00')
				.setTitle('<a:orangejustice:522142267490697236>	Eval succes <a:orangejustice:522142267490697236>')
				.setThumbnail('https://cdn4.iconfinder.com/data/icons/gradient-ui-1/512/success-512.png')
				.addField('Input', `\`\`\`js\n${code}\`\`\``)
				.addField('Output', `\`\`\`js\n${clean(evaled)}\`\`\``)
				.setTimestamp();

			message.channel.send(evalEmbed);
		} catch (err) {
			const errorEmbed = new MessageEmbed()
				.setColor('#FF0000')
				.setTitle('Eval failed <:sadpepe:534399181679230986>')
				.setThumbnail('https://cdn4.iconfinder.com/data/icons/the-weather-is-nice-today/64/weather_48-512.png')
				.addField('Input', `\`\`\`js\n${args.eval}\`\`\``)
				.addField('Output', `\`\`\`js\n${clean(err)}\`\`\``)
				.setTimestamp();

			message.channel.send(errorEmbed);
		}
	}
}

module.exports = EvalCommand;