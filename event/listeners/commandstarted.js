const { Listener } = require('discord-akairo');

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
		if (today == '01/04') {
			let count = Math.random() * 100;
			if (count < 5) {
				console.log('Gold triggered!');
				this.client.user.setActivity('people buy haha yes gold™', { type: 'WATCHING' });
				return message.channel.send('To further utilize this command, please visit https://namejeff.xyz/gold', {files: ['img/gold.png']});
			}
		}
	}
}

module.exports = commandStartedListener;