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
			if (missing == 'SEND_MESSAGES') {
				return;
			} else {
				message.reply(`Im missing the required permissions for this command!, \`${missing}\``);
			}
			break;
		case 'user':
			if (missing == 'SEND_MESSAGES') {
				return message.author.send(`You are missing some permissions to use this command!, \`${missing}\``);
			} else {
				message.reply(`You are missing some permissions to use this command!, \`${missing}\``);
			}
			
			break;
		}
	}
}

module.exports = missingPermissionsListener;