const { Command } = require('discord-akairo');

class OwnedCommand extends Command {
	constructor() {
		super('owned', {
			aliases: ['owned', 'own'],
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
		let epicMessage = ['You cheated not ONLY the GAME, BUT yourself. You didn\'t GROW. You didn\'t IMPROVE. You TOOK a SHORTCUT and gained NOTHING. You EXPERIENCED a HOLLOW victory. NOTHING WAS risked and NOTHING WAS gained. It\'s SAD that you don\'t KNOW the DIFFERENCE.', 'TROLOLOLO OWNED EPIC STYLE', 'Owned noob', 'HAHA BRO YOU JUST GOT OOOOOOOOWNED HAHAHAHAHHAHA NOOOB NOOOOB NOOOB OWNED NOOB <:youngtroll:488559163832795136>', '<a:op:516341492982218756> op op op owned epic style <a:op:516341492982218756>', 'HAHAHA BRO YOU HAVE BEEN OWNED TROLL BRO STYLE', 'OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED YOU JUST GOT OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED YOU JUST GOT OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED YOU JUST GOT OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED OWNED YOU JUST GOT OWNED', 'OWNED\nFUCKING OWNED', 'OWNED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', 'You just got owned <a:troll:525724709833277442>', 'you just been....epicly trolled <:trole:241942993022615552>', 'I hope you have a nice day, just a simple reminder that I love you and I think you\'re pretty epic!!!!'];
		
		let ownedMessage = epicMessage[Math.floor( Math.random() * epicMessage.length )];
		let owned = args.member;

		if (args.member) {

			if (args.member.id === this.client.user.id) {
				return message.reply('You really thought you could own me?, pathetic...');
			} else if (args.member.id === this.client.ownerID) {
				return message.reply('You really thought you could own him?, pathetic...');
			} else if (args.member.id === '286054184623538177' || args.member.id === '172112210863194113') {
				owned = message.author;
			}



			if (ownedMessage === epicMessage[0]) {
				return message.reply(ownedMessage);
			}
			
			return message.channel.send(`${owned}, ${ownedMessage}`);
		} else {
			return message.channel.send(ownedMessage);
		}
	}
}

module.exports = OwnedCommand;