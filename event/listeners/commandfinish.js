const { Listener } = require('discord-akairo');

class commandFinishedListener extends Listener {
	constructor() {
		super('commandFinished', {
			emitter: 'commandHandler',
			event: 'commandFinished'
		});
	}

	async exec(message, command) {
		console.timeEnd(command.id);
	}
}

module.exports = commandFinishedListener;