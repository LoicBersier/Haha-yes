const { Listener } = require('discord-akairo');

class loadListener extends Listener {
	constructor() {
		super('load', {
			emitter: 'commandHandler',
			event: 'load'
		});
	}

	async exec(command, isReload) {
		if (isReload) {
			console.log(`Successfully reloaded command \x1b[32m${command.categoryID}/${command.id}\x1b[0m`);
		} else {
			console.log(`Successfully loaded command \x1b[32m${command.categoryID}/${command.id}\x1b[0m`);
		}
	}
}

module.exports = loadListener;