const { Command } = require('discord-akairo');
const whois = require('whois');

class whoisCommand extends Command {
	constructor() {
		super('whois', {
			aliases: ['whois'],
			category: 'utility',
			args: [
				{
					id: 'domain',
					type: 'string',
					match: 'rest',
				}
			],
			description: {
				content: 'Show\'s whois data about website. (ATTENTION, CAN BE SPAMMY)',
				usage: '[website]',
				examples: ['namejeff.xyz']
			}
		});
	}

	async exec(message, args) {
		whois.lookup(args.domain, function(err, data) {
			return message.channel.send(data, {split: true, code: true });
		});
	}
}

module.exports = whoisCommand;