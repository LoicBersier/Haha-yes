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
		let blacklistMessage;
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
			blacklistMessage = ['bro... i think you are blacklisted.... OWNED!!!', 'You can\'t use this command because you have been blacklisted!',' you are blacklisted!!!1111!! be less naughty next time!', 'blacklisted,,,,,, lol owned bro'];
			blacklistMessage = blacklistMessage[Math.floor( Math.random() * blacklistMessage.length )];
			message.reply(blacklistMessage);
			break;
		case 'serverblacklist': 
			message.channel.send('This server have been blacklisted... to appeal contact Supositware#1616, and now i will yeet out of here');
			message.guild.leave();
			break;
		}
	}
}

module.exports = CommandBlockedListener;