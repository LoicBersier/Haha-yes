const { Listener } = require('discord-akairo');

class cooldownListener extends Listener {
	constructor() {
		super('cooldown', {
			emitter: 'commandHandler',
			event: 'cooldown'
		});
	}

	async exec(message, command, number) {
		let seconds = parseInt((number / 1000) % 60),
			minutes = parseInt((number / (1000 * 60)) % 60),
			hours = parseInt((number / (1000 * 60 * 60)) % 24);
	
		hours = (hours < 10) ? '0' + hours : hours;
		minutes = (minutes < 10) ? '0' + minutes : minutes;
		seconds = (seconds < 10) ? '0' + seconds : seconds;
	
		let time = hours + ':' + minutes + ':' + seconds;

		message.reply(`You can use the \`${command.id}\` command in \`${time}\``);
	}
}

module.exports = cooldownListener;