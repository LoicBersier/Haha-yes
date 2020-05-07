const { Listener } = require('discord-akairo');
const { dailyStats } = require('../../config.json');
let serverID = require('../../json/serverID.json'); 
let report = [];
let time = new Date();

class commandStartedListener extends Listener {
	constructor() {
		super('commandStarted', {
			emitter: 'commandHandler',
			event: 'commandStarted'
		});
	}

	async exec(message, command) {
		console.time(command.id);

		//This is for april fools
		let today = new Date(), lastUpdate;
		
		let dd = today.getDate();
		let mm = today.getMonth() + 1; //January is 0!

		if (dd < 10) {
			dd = '0' + dd;
		} 
		if (mm < 10) {
			mm = '0' + mm;
		} 
		let curDate = dd + '.' + mm;
		//Only execute when its april first
		if (curDate === '01.04' && !serverID.includes(message.guild.id)) {
			let count = Math.random() * 100;
			if (count < 10) {
				serverID.push(message.guild.id);

				const channel = this.client.channels.resolve('694715943372193803'); // Too lazy to make entry for it
				channel.send(`${message.guild.name} (${message.guild.id}) got april fool triggered! hueheheh owned`);

				this.client.user.setActivity('people buy haha yes gold™', { type: 'WATCHING' });
				let Embed = this.client.util.embed()
					.setColor(message.member ? message.member.displayHexColor : 'NAVY')
					.setTitle('Haha yes **gold**')
					.setDescription('To further utilize this command, please visit https://namejeff.xyz/gold')
					.attachFiles(['./asset/img/gold.png'])
					.setImage('attachment://gold.png')
					.setFooter('This is an april fool\'s joke, no command will EVER be behind a paywall');

				message.channel.send(Embed);
			}
		}

		if (dailyStats) {
			if (command.category.id === 'owner') return; // Don't count owner command
			let obj = {
				guild: message.guild.id,
				command: command.id
			};
			
			report.push(obj);
	
			let uniqueGuild = [];
			let commands = {};
			let executedCommands = 0;
	
			report.forEach(e => {
				if (!uniqueGuild.includes(e.guild)) {
					uniqueGuild.push(e.guild);
				}
	
				if (!commands[e.command]) {
					commands[e.command] = 1;
				} else {
					commands[e.command] = commands[e.command] + 1;
				}

				executedCommands++;
				
			});
	
			if ( !lastUpdate || ( today.getTime() - lastUpdate.getTime() ) > 30000 ) {
				// Set the last time we checked, and then check if the date has changed.
				lastUpdate = today;
				if ( time.getDate() !== today.getDate() ) {
				// If the date has changed, set the date to the new date, and refresh stuff.
					time = today;
	
					let arr = Object.values(commands);
					let max = Math.max(...arr);
					let min = Math.min(...arr);
	
					let Embed = this.client.util.embed()
						.setColor('GREEN')
						.setTitle('Daily usage report!')
						.addField('Number of unique guild', uniqueGuild.length)
						.addField('Number of command exectued', executedCommands, true)
						.addField('Most used command', `${getKeyByValue(commands, max)} (${max} times)`, true )
						.addField('Least used command', `${getKeyByValue(commands, min)} (${min} times)`, true)
						.setFooter(`Bot usage as of ${today}`);
	
	
	
					const channel = this.client.channels.resolve(dailyStats);
					channel.send(Embed);

					uniqueGuild = [];
					commands = {};
					report = [];
				}
			}
		}

		function getKeyByValue(object, value) {
			return Object.keys(object).find(key => object[key] === value);
		}

	}
}

module.exports = commandStartedListener;