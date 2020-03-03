const { Listener } = require('discord-akairo');
let serverID = require('../../json/serverID.json'); 

class commandStartedListener extends Listener {
	constructor() {
		super('commandStarted', {
			emitter: 'commandHandler',
			event: 'commandStarted'
		});
	}

	async exec(message) {
		//This is for april fools
		let today = new Date();
		let dd = today.getDate();
		let mm = today.getMonth() + 1; //January is 0!
		
		if (dd < 10) {
			dd = '0' + dd;
		} 
		if (mm < 10) {
			mm = '0' + mm;
		} 
		today = dd + '/' + mm;
		//Only execute when its april first
		if (today == '01/04' && !serverID.includes(message.guild.id)) {
			let count = Math.random() * 100;
			if (count < 10) {
				serverID.push(message.guild.id);
				console.log('Gold triggered!');
				this.client.user.setActivity('people buy haha yes gold™', { type: 'WATCHING' });
				let Embed = this.client.util.embed()
					.setColor(message.member.displayHexColor)
					.setTitle('Haha yes **gold**')
					.setDescription('To further utilize this command, please visit https://namejeff.xyz/gold')
					.attachFiles(['./asset/img/gold.png'])
					.setImage('attachment://gold.png')
					.setFooter('This is an april fool\'s joke, no command will EVER be behind a paywall');

				return message.channel.send(Embed);
			}
		}
	}
}

module.exports = commandStartedListener;