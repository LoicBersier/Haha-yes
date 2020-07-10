const { Listener } = require('discord-akairo');
const mkdirp = require('mkdirp');
const fs = require('fs');
const { errorChannel } = require('../../config.json');

class errorListener extends Listener {
	constructor() {
		super('error', {
			emitter: 'commandHandler',
			event: 'error'
		});
	}

	async exec(error, message, command) {
		console.error(`Error happened on the command: ${command.id}\n${error}\nOn the message: ${message}`);
		const channel = this.client.channels.resolve(errorChannel);
		const errorEmbed = this.client.util.embed()
			.setColor('RED')
			.setTitle('Shit happened!')
			.addField('Command', command.id, true)
			.addField('Error', error, true)
			.addField('Message', message, true);

		if (message.author) errorEmbed.addField('Author', `${message.author.tag} (${message.author.id})`);
		if (message.guild) errorEmbed.addField('Guild', `${message.guild.name} (${message.guild.id})`);

		channel.send(errorEmbed);

		//Get current date
		let today = new Date();
		let dd = today.getDate();
		let mm = today.getMonth() + 1; //January is 0!
		
		let yyyy = today.getFullYear();
		if (dd < 10) {
			dd = '0' + dd;
		} 
		if (mm < 10) {
			mm = '0' + mm;
		} 
		today = dd + '/' + mm + '/' + yyyy;
		//Get current hour
		let time = new Date();
		let currentTime = time.getHours() + '_' + time.getMinutes() + '_' + time.getSeconds();
		//Create folder with current date
		mkdirp(`./error/${today}`, function (err){
			if (err) {
				console.error(err);
			}
			//Create txt with the current time
			fs.writeFile(`./error/${today}/${currentTime}.txt`, `Error happenend on the command: ${command.id}\n${error}\nOn the message: ${message}`, function (err) {
				if (err) {
					console.error(err);
				}
				console.log(`Logged error succesfully in /error/${today}/${currentTime}.txt`);
			});
		});
	}
}


module.exports = errorListener;