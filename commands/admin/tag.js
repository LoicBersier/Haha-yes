const { Command } = require('discord-akairo');
const fs = require('fs');

class TagCommand extends Command {
	constructor() {
		super('tag', {
			aliases: ['tag'],
			category: 'admin',
			split: 'quoted',
			userPermissions: ['MANAGE_MESSAGES'],
			args: [
				{
					id: 'trigger',
					type: 'string',
					prompt: {
						start: 'What word or sentence should trigger it?',
					}
				},
				{
					id: 'response',
					type: 'string',
					match: 'rest',
					prompt: {
						start: 'What word or sentence should the response be?',
					}
				}
			],
			channelRestriction: 'guild',
			description: {
				content: 'Create custom autoresponse  [Click here to see the complete list of "tag"](https://cdn.discordapp.com/attachments/502198809355354133/561043193949585418/unknown.png) (Need "" if the trigger contains spaces)',
				usage: '[trigger] [response]',
				examples: ['"do you know da wea" Fuck off dead meme', 'hello Hello [author], how are you today?']
			}
		});
	}

	async exec(message, args) {
		if (args.trigger == null || args.response == null) return;
		let trigger = args.trigger;
		let response = args.response;

		trigger = trigger.toLowerCase();

		let customresponse = {};
		let json = JSON.stringify(customresponse);

		fs.readFile(`./tag/${message.guild.id}.json`, 'utf8', function readFileCallback(err, data) {
			if (err) {
				fs.writeFile(`./tag/${message.guild.id}.json`, `{"${trigger}":"${response}"}`, function (err) {
					if (err) {
						
						console.log(err);
					}
				});
			} else {
				customresponse = JSON.parse(data); //now it an object
				customresponse[trigger] = response;
				json = JSON.stringify(customresponse); //convert it back to json
				fs.writeFile(`./tag/${message.guild.id}.json`, json, 'utf8', function (err) {
					if (err) {
						return console.log(err);
					}
				});
			}
		});

		
		return message.channel.send(`autoresponse have been set to ${trigger} : ${response}`);
	}
}

module.exports = TagCommand;