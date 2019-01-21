const { Listener } = require('discord-akairo');

class CommandBlockedListener extends Listener {
	constructor() {
		super('commandBlocked', {
			emitter: 'commandHandler',
			event: 'commandBlocked'
		});
	}

	async exec(message, command, reason) {
		console.log(`${message.author.username} was blocked from using ${command.id} because of ${reason}!`);
		let ownerMessage;
		switch(reason) {
		case 'owner':
			ownerMessage = ['Nice try but you aren\'t the owner <a:memed:433320880135733248>', 'LOADING SUPER SECRET COMMAND <a:loadingmin:527579785212329984> Wait a minute... you aren\'t the owner!', 'uhm, how about no'];
			ownerMessage = ownerMessage[Math.floor( Math.random() * ownerMessage.length )];
			message.reply(ownerMessage);
			break;
		case 'guild':
			message.reply('You can\'t use this command in a guild!');
			break;
		case 'dm':
			message.reply('You can\'t use this command in DM!');
			break;
		case 'blacklist': 
			message.reply('You can\'t use this command because you have been blacklisted!');
			break;
		case 'serverblacklist': 
			message.guild.leave();
			break;
		}
	}
}

module.exports = CommandBlockedListener;