const { Listener } = require('discord-akairo');

class missingPermissionsListener extends Listener {
	constructor() {
		super('missingPermissions', {
			emitter: 'commandHandler',
			event: 'missingPermissions'
		});
	}

	async exec(message, command, type, missing) {
		let Embed = this.client.util.embed()
			.setColor('RED')
			.setTitle('Missing permission')
			.setDescription(`Im missing the required permissions for the ${command.id} command!`)
			.addField('Missing permission:', missing);

		switch(type) {
		case 'client':
			if (missing == 'SEND_MESSAGES') {
				return;
			} else {
				message.reply(Embed);
			}
			break;
		case 'user':
			if (missing == 'SEND_MESSAGES') {
				Embed.setDescription(`You are missing the required permissions for the ${command.id} command!`);
				return message.author.send(Embed);
			} else {
				Embed.setDescription(`You are missing the required permissions for the ${command.id} command!`);
				message.reply(Embed);
			}
			break;
		}
	}
}

module.exports = missingPermissionsListener;