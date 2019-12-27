const { Listener } = require('discord-akairo');

class unhandledRejectionListener extends Listener {
	constructor() {
		super('unhandledRejection', {
			emitter: 'process',
			event: 'unhandledRejection'
		});
	}

	async exec(error) {
		return console.error(`\x1b[31mUncaught Promise Rejection: ${error}\x1b[37m`);
	}
}

module.exports = unhandledRejectionListener;