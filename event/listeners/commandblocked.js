const { Listener } = require('discord-akairo');
const Blacklists = require('../../models').Blacklists;

class CommandBlockedListener extends Listener {
	constructor() {
		super('commandBlocked', {
			emitter: 'commandHandler',
			event: 'commandBlocked'
		});
	}

	async exec(message, command, reason) {
		const blacklist = await Blacklists.findOne({where: {type:command.id, uid:message.author.id}});
		console.log(`${message.author.username} was blocked from using ${command.id} because of ${reason}!`);
		let ownerMessage;
		let blacklistMessage;
		let Embed = this.client.util.embed()
			.setColor('RED')
			.setTitle('Error')
			.setDescription('Something blocked you');

		switch(reason) {
		case 'owner':
			ownerMessage = ['Nice try but you aren\'t the owner <a:memed:433320880135733248>', 'LOADING SUPER SECRET COMMAND <a:loadingmin:527579785212329984> Wait a minute... you aren\'t the owner!', 'uhm, how about no'];
			Embed.setTitle('You are not the owner.');
			Embed.setDescription(ownerMessage[Math.floor( Math.random() * ownerMessage.length )]);
			message.reply(Embed);
			break;
		case 'guild':
			message.reply('You can\'t use this command in DM!');
			break;
		case 'dm':
			message.reply('You can\'t use this command in a guild!');
			break;
		case 'blacklist': 
			blacklistMessage = ['bro... i think you are blacklisted.... OWNED!!!', 'You can\'t use this command because you have been blacklisted!',' you are blacklisted!!!1111!! be less naughty next time!', 'blacklisted,,,,,, lol owned bro'];
			Embed.setTitle('You are blacklisted.');
			Embed.setDescription(blacklistMessage[Math.floor( Math.random() * blacklistMessage.length )]);
			message.reply(Embed);
			break;
		case 'serverblacklist': 
			Embed.setTitle('Server blacklisted.');
			Embed.setDescription(`This server have been blacklisted... to appeal contact ${this.client.users.resolve(this.client.ownerID).tag}, and now i will yeet out of here`);
			message.channel.send(Embed);
			message.guild.leave();
			break;
		case 'commandblock':
			Embed.setTitle('Command blocked.');
			Embed.setDescription('The admins of this server blocked this command.');
			message.channel.send(Embed);
			break;
		case 'commandblacklist':
			Embed.setTitle('Command blocked.');
			Embed.setDescription(`You've been blocked from this command for the following reason: \`${blacklist.reason}\``);
			message.channel.send(Embed);
			break;
		}
	}
}

module.exports = CommandBlockedListener;