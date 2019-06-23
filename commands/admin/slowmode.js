const { Command } = require('discord-akairo');

class SlowmodeCommand extends Command {
	constructor() {
		super('Slowmode', {
			aliases: ['slowmode', 'slow', 'cooldown'],
			category: 'admin',
			args: [
				{
					id: 'slowmodeNumber',
					prompt: {
						start: 'what do you want the delay to be between each message?',
					},
					type: 'integer'
				},
				{
					id: 'realtime',
					prompt: {
						start: 'For how long should the slowmode last?',
						optional: true
					},
					type: 'integer',
				}
			],
			clientPermissions: ['MANAGE_CHANNELS'],
			userPermissions: ['MANAGE_MESSAGES'],
			channelRestriction: 'guild',
			description: {
				content: 'Put a channel in slowmode',
				usage: '[1-120 slowmode] [time it stays on]',
				examples: ['267065637183029248']
			}
		});
	}

	async exec(message,args) {
		try {
			let slowmodeNumber = args.slowmodeNumber;
			let realtime = args.realtime;
	
			if (slowmodeNumber > 120)
				return message.channel.send('Slowmode can only be set to 120 seconds or lower!');
	
			message.channel.setRateLimitPerUser(slowmodeNumber);
	
			if (realtime) {
				let time = 60000 * realtime;
				message.channel.send(`Slowmode have been set to ${slowmodeNumber} seconds and will end in ${realtime} minutes!`);
				setTimeout (function (){
					message.channel.setRateLimitPerUser(0);
					return message.channel.send('Slowmode is now disabled!');
				}, time);
			} else {
				if (slowmodeNumber == 0)
					return message.channel.send('Slowmode have been disabled!');
				return message.channel.send(`Slowmode have been set to ${slowmodeNumber} seconds!`);
			}
		} catch (err) {
			console.error(err);
		}

	}
}

module.exports = SlowmodeCommand;