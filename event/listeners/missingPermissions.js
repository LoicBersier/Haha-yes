const { Listener } = require('discord-akairo');

class missingPermissionsListener extends Listener {
	constructor() {
		super('missingPermissions', {
			emitter: 'commandHandler',
			event: 'missingPermissions'
		});
	}

	async exec(message, command, type, missing) {
		switch(type) {
		case 'client':
			message.reply(`Im missing the required permissions for this command!, \`${missing}\``);
			break;
		case 'user':
			message.reply(`You are missing some permissions to use this command!, \`${missing}\``);
			break;
		}
	}
}

module.exports = missingPermissionsListener;