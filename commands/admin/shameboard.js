const { Command } = require('discord-akairo');
const fs = require('fs');

class shameboardCommand extends Command {
	constructor() {
		super('shameboard', {
			aliases: ['shameboard'],
			category: 'admin',
			channelRestriction: 'guild',
			userPermissions: ['ADMINISTRATOR'],
			description: {
				content: 'Set shameboard',
				usage: '[]',
				examples: ['']
			}
		});
	}

	async exec(message) {
		let shameboardChannel = message.channel.id;

		fs.readFile(`./starboard/${message.guild.id}.json`, 'utf8', function readFileCallback(err, data) {
			if (err) {
				fs.writeFile(`./starboard/${message.guild.id}.json`, `{"shameboard": "${shameboardChannel}"}`, function (err) {
					if (err) {
						console.log(err);
					}
					fs.close(2);
					return message.channel.send('This channel have been set as the shameboard');
				});
			} else {
				let shameboard = JSON.parse(data); //now it an object
				shameboard['shameboard'] = shameboardChannel;
				var json = JSON.stringify(shameboard); //convert it back to json
				fs.writeFile(`./starboard/${message.guild.id}.json`, json, 'utf8', function (err) {
					if (err) {
						fs.close(2);
						return console.log(err);
					}
				});
			}
		});
		fs.close(2);
		return message.channel.send('This channel have been set as the shameboard');
	}
}

module.exports = shameboardCommand;