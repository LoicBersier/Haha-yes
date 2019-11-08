const { Command } = require('discord-akairo');

class bsespamCommand extends Command {
	constructor() {
		super('bsespam', {
			aliases: ['bsespam'] ,	//Required
			category: 'reserved',	//recommended
			channelRestriction: 'guild',	  //needed if you want to restrict where we can launch the command
			cooldown: 1800000,
			ratelimit: 2,
			args: [						//if need args
				{
					id: 'number',
					type: 'interger',
				},
				{
					id: 'text',
					type: 'string',
					match: 'rest'
				}
			],
			description: {				//recommended 
				content: 'ONLY FOR BIG SNOW ENERGY\nSpam the text you send',
				usage: '[args]',
				examples: ['']
			}
		});
	}

	async exec(message, args) {
		/*
		if (message.author.id != '428387534842626048')
			return;
			*/
		if (args.number <= 10) {
			for(let i = 0; i < args.number; i++) {
				message.channel.send(args.text);
			}
			return message.channel.send('Finished :)');
		} else {
			return message.channel.send('No more than 10!');
		}
	}
}

module.exports = bsespamCommand;