const { Command } = require('discord-akairo');
const { ownerID } = require('../../config.json');

class OwnedCommand extends Command {
	constructor() {
		super('owned', {
			aliases: ['owned'],
			category: 'hidden',
			args: [
				{
					id: 'member',
					type: 'member',
					match: 'rest'
				}
			],
			description: {
				content: 'OWNED',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message, args) {
		let ownedMessage = ['TROLOLOLO OWNED EPIC STYLE', 'Owned noob', 'HAHA BRO YOU JUST GOT OOOOOOOOWNED HAHAHAHAHHAHA NOOOB NOOOOB NOOOB OWNED NOOB <:youngtroll:488559163832795136>', '<a:op:516341492982218756> op op op owned epic style <a:op:516341492982218756>', 'HAHAHA BRO YOU HAVE BEEN OWNED TROLL BRO STYLE', 'OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED YOU JUST GOT OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED YOU JUST GOT OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED YOU JUST GOT OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED YOU JUST GOT OWNED', 'OWNED\nFUCKING OWNED', 'OWNED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', 'You just got owned <a:troll:525724709833277442>', 'you just been....epicly trolled <:trole:241942993022615552>'];
		ownedMessage = ownedMessage[Math.floor( Math.random() * ownedMessage.length )];

		if (args.member) {

			if (args.member.id == this.client.user.id) {
				return message.channel.send('You really thought you could own me?, pathethic...');
			} else if (args.member.id == ownerID) {
				return message.channel.send('You really thought you could own him?, pathethic...');
			}

			return message.channel.send(`${args.member}, ${ownedMessage}`);
		} else {
			return message.channel.send(ownedMessage);
		}
	}
}

module.exports = OwnedCommand;