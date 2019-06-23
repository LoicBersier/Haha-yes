const fs = require('fs');
const { Command } = require('discord-akairo');

class autoresponseCommand extends Command {
	constructor() {
		super('autoresponse', {
			aliases: ['autoresponse'],
			category: 'admin',
			args: [
				{
					id: 'text',
					type: 'string',
					prompt: {
						start: 'Do you want to **enable** or **disable** auto response?',
					}
				},
				{
					id: 'all',
					type: 'string'
				}
			],
			userPermissions: ['MANAGE_MESSAGES'],
			channelRestriction: 'guild',
			description: {
				content: 'enable/disable autoresponse',
				usage: '[enable/disable] (optional) [all]',
				examples: ['enable all']
			}
		});
	}

	async exec(message, args) {
		let text = args.text;
		let all = args.all;

		if (text.toLowerCase() == 'enable' || text.toLowerCase() == 'disable') {
			let autoresponse = {};
			let json = JSON.stringify(autoresponse);
	
			if (all == 'all') {
				const guild = this.client.guilds.get(message.guild.id);
	
				fs.readFile('./json/autoresponse.json', 'utf8', function readFileCallback(err, data) {
					if (err) {
						
						console.log(err);
					} else {
	
						autoresponse = JSON.parse(data); //now it an object
						guild.channels.forEach(channel => autoresponse[channel] = text.toLowerCase());
						json = JSON.stringify(autoresponse); //convert it back to json
						json = json.replace(/[<#>]/g, '');
						fs.writeFile('./json/autoresponse.json', json, 'utf8', function (err) {
							if (err) {
								
								return console.log(err);
							}
						});
					}
				});
	
				
				return message.channel.send('Auto response have been disable/enable on every channel');
	
			} else if (text.toLowerCase() == 'disable' || text.toLowerCase() == 'enable') {
				fs.readFile('./json/autoresponse.json', 'utf8', function readFileCallback(err, data) {
					if (err) {
						console.log(err);
					} else {
						autoresponse = JSON.parse(data); //now it an object
						autoresponse[message.channel.id] = text.toLowerCase();
						json = JSON.stringify(autoresponse); //convert it back to json
						fs.writeFile('./json/autoresponse.json', json, 'utf8', function (err) {
							if (err) {
								
								return console.log(err);
							}
						});
					}
				});
			}
	
			
			return message.channel.send(`Autoresponse have been ${text.toLowerCase()}d`);
		} else {
			return message.channel.send('You didin\'t type a valid input');

		}
	}
}
module.exports = autoresponseCommand;