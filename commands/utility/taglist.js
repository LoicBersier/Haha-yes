const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const reload = require('auto-reload');
const fs = require('fs');

class taglistCommand extends Command {
	constructor() {
		super('taglist', {
			aliases: ['taglist', 'tags'],
			category: 'utility',
			channelRestriction: 'guild',
			args: [
				{
					id: 'raw',
					type: 'string',
				}
			],
			description: {
				content: 'Show the list of tag for this server.',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message, args) {
		try {
			var customresponse = reload(`../../tag/${message.guild.id}.json`);
			var count = Object.keys(customresponse).length;
		} catch (err) {
			message.channel.send('An error has occured, do you have any tags on the server?');
			console.error(err);
		}
		await fs.readFile(`./tag/${message.guild.id}.json`, 'utf8', function readFileCallback(err, data) {
			if (err) {
				console.log(err);
				
				return;
			}
			let json = JSON.parse(data);
			if (args.raw) {
				const tagEmbed = new MessageEmbed()
					.setColor('#ff9900')
					.setTitle(args.raw)
					.setDescription(json[args.raw]);

				return message.channel.send(tagEmbed);
			}

			json = JSON.stringify(data);
			json = json.replace(/[{}'\\]+/g, '');
			json = json.replace(/,+/g, '\n');

			const tagEmbed = new MessageEmbed()
				.setColor('#ff9900')
				.setTitle('Tags list')
				.setDescription(`Trigger:Response\n\n${json}`)
				.setFooter(`You have ${count} tags on this server`);

			message.channel.send(tagEmbed);
		});
		
	}
}

module.exports = taglistCommand;