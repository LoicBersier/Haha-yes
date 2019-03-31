//THIS IS FOR APRIL FOOLS PLEASE DELETE ME AFTER
const { Listener } = require('discord-akairo');

class commandStartedListener extends Listener {
	constructor() {
		super('commandStarted', {
			emitter: 'commandHandler',
			event: 'commandStarted'
		});
	}

	async exec(message) {
		let count = Math.random() * 100;
		if (count < 20)  {
			message.channel.send('To further utilize this command, please visit https://namejeff.xyz/gold');
		}
	}
}

module.exports = commandStartedListener;